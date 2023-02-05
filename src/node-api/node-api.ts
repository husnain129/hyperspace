/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable promise/catch-or-return */
/* eslint-disable consistent-return */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs, { createWriteStream } from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { MerkleTree } from 'merkletreejs';
import { ethers } from 'ethers';
import crypto from 'crypto';
import { ContractAPI } from 'main/contract-api';
import { promisify } from 'util';
import { finished } from 'stream';
import { ProtoGrpcType } from './proto/storage-node';

const streamFinished = promisify(finished);

const protoFile = path.join(__dirname, '../../assets', 'storage-node.proto');
// const f = fs.readFileSync(protoFile);
// const t = f.toString('utf-8');
// console.log('GProto');
// console.log(t.slice(0, 100));

export interface IGetMerkleProofResponse {
  segmentIndex: number;
  segmentCount: number;
  root: Buffer;
  proof: Buffer[];
  data: Buffer;
  directions: number[];
}
const pkgDef = protoLoader.loadSync(protoFile);

const proto = grpc.loadPackageDefinition(pkgDef) as unknown as ProtoGrpcType;

const NodeAPI = {
  getClient(host: string) {
    const client = new proto.proto.StorageNode(
      host.replace('http://', ''),
      grpc.credentials.createInsecure()
    );
    return client;
  },
  Ping(
    host: string,
    fileSize: number,
    segmentsCount: number,
    timePeriod: number
  ) {
    const client = this.getClient(host);
    return new Promise((resolve, reject) => {
      const timeStarted = Date.now();
      client.Ping(
        {
          bidPrice: '0',
          fileSize,
          segmentsCount,
          timePeriod,
        },

        (err, data) => {
          if (err || !data) {
            return reject(err);
          }

          return resolve({
            latency: Date.now() - timeStarted,
            canStore: data.canStore,
            bidPrice: BigInt(data.bidPrice),
          });
        }
      );
    });
  },
  InitTransaction(
    host: string,
    userAddress: string,
    bid: string,
    fileHash: string,
    fileSize: number,
    segmentsCount: number,
    timeStart: number,
    timeEnd: number
  ): Promise<{ jwt: string; httpURL: string }> {
    const client = this.getClient(host);
    return new Promise<{ jwt: string; httpURL: string }>((resolve, reject) => {
      console.log(
        'Params:',
        userAddress,
        fileHash,
        bid,
        fileSize,
        segmentsCount,
        timeStart,
        timeEnd
      );
      client.InitTransaction(
        {
          userAddress,
          bid,
          fileHash,
          fileSize,
          segmentsCount,
          timeStart,
          timeEnd,
          concludeTimeout: 60 * 60 * 60, // 1 hour
          ProveTimeout: 30,
        },
        (err, resp) => {
          if (err || !resp || !resp.JWT || !resp.httpURL) {
            console.warn(err);

            return reject(err || 'init tx failed');
          }
          console.log('JWT:', resp.JWT);
          resolve({ httpURL: resp.httpURL, jwt: resp.JWT });
        }
      );
    });
  },

  async GetMerkleProof(
    host: string,
    fileKey: string,
    segmentIndex: number
  ): Promise<IGetMerkleProofResponse> {
    const client = this.getClient(host);
    return new Promise((resolve, reject) => {
      client.GetIntegrityProof({ fileKey, segmentIndex }, (err, val) => {
        if (err || !val) {
          console.warn(err);
          reject(err);

          return;
        }
        resolve({
          data: val.data,
          proof: val.proof,
          root: val.root,
          directions: val.directions,
          segmentCount: val?.SegmentIndex.toInt(),
          segmentIndex: val?.segmentsCount.toInt(),
        });
      });
    });
  },
  async ComputeMerkleRootHash(
    filePath: string,
    segmentsCount: number,
    progressCallback: (p: number) => void
  ) {
    const fstats = fs.statSync(filePath);
    console.log('Computing hash');

    const fileSize = fstats.size;
    // const segmentsCount = Math.ceil(fileSize / (1024 * 1));

    const lastChunkSize = fileSize % 1024;

    let chunkSize: number;

    if (segmentsCount === 1) {
      chunkSize = lastChunkSize;
    } else {
      chunkSize = Math.floor((fileSize - lastChunkSize) / (segmentsCount - 1));
    }

    console.log('Chunk Size: ', chunkSize);
    console.log('Segments: ', segmentsCount);

    const f = fs.createReadStream(filePath, {
      // highWaterMark: 1024 * 1024 * 1024, // chunkSize
    });
    f.pause();

    const hash = (bytes: any): Buffer => {
      // console.log('Hash:', ethers.utils.keccak256(bytes));

      return Buffer.from(ethers.utils.keccak256(bytes).slice(2), 'hex'); // 'hex';
      // const sha = crypto.createHash('sha256');
      // sha.update(bytes);

      // return sha.digest();
    };

    const leaves: Buffer[] = [];
    let read = 0;
    let lastP = 0;

    return new Promise((resolve, reject) => {
      f.on('readable', () => {
        let data: Buffer | null;
        // eslint-disable-next-line no-cond-assign
        while ((data = f.read(chunkSize)) != null) {
          if (!data) return;
          read += data.length;
          // console.log(`>${data.length}`);
          // process.stdout.write(`\r>${((read / fileSize) * 100).toString()}`);
          leaves.push(hash(data));

          const p = read / fileSize;
          if (p - lastP >= 0.01) {
            // fire when delta is >=0.01
            progressCallback(p);
            lastP = p;
          }
        }
      }).on('end', () => {
        console.log('END', leaves.length, leaves[0]);
        const tree = new MerkleTree(leaves, hash, {
          duplicateOdd: true,
          sort: false,
        });
        const root = tree.getRoot().toString('hex');
        console.log('ENDROOT:', root);
        resolve(root);
      });
    });
  },
  HTTPUploadFile(
    filePath: string,
    url: string,
    token: string,
    progressCallback: (progress: number) => void,
    onError: (err: Error) => void,
    onComplete: ({ download_url }: { download_url: string }) => void,
    fileKey: string
  ) {
    const fileSize = fs.statSync(filePath).size;
    const controller = new AbortController();
    const stream = fs.createReadStream(filePath);
    const fd = new FormData();
    console.log('Begin upload');
    fd.append('file', stream);
    axios
      .post(url, fd, {
        signal: controller.signal,
        headers: {
          ...fd.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress(progressEvent) {
          if (!progressCallback) return;
          if (progressEvent.total === -1) progressCallback(-1);
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || fileSize)
          );
          return progressCallback(percentCompleted);
        },
      })
      // eslint-disable-next-line promise/always-return
      .then((r) => {
        console.log(r.data);
        console.log('Upload Complete');
        onComplete({ download_url: r.data.download_url });
      })
      .catch((er) => {
        console.warn(er);

        onError(er);
      });

    return controller;
  },
  HTTPDownloadFile(
    url: string,
    token: string,
    fileKey: string,
    dest: string,
    progressCallback: (progress: number) => void,
    onError: (err: Error) => void,
    onComplete: () => void
  ) {
    const controller = new AbortController();
    const writeStream = createWriteStream(dest);

    axios
      .get(url, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'stream',
        onDownloadProgress(progressEvent) {
          if (!progressCallback) return;
          if (progressEvent.total === -1) progressCallback(-1);
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || 1)
          );
          return progressCallback(percentCompleted);
        },
      })
      // eslint-disable-next-line promise/always-return
      .then((response) => {
        response.data.pipe(writeStream);
        return streamFinished(writeStream);
      })
      .then(() => {
        console.log('Download Complete');
        onComplete();
      })
      .catch((er) => {
        console.log('Download failed');
        console.warn(er);

        onError(er);
      });

    return controller;
  },

  GetStats(host: string): Promise<{ freeStorage: number; latency: number }> {
    const client = this.getClient(host);
    return new Promise((resolve, reject) => {
      const timeStarted = Date.now();
      client.GetStats({}, (err, data) => {
        if (err || !data) {
          reject(err);
        } else {
          return resolve({
            freeStorage: data.freeStorage,
            latency: Date.now() - timeStarted,
          });
        }
      });
    });
  },
};
export default NodeAPI;
