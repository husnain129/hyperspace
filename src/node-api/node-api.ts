/* eslint-disable consistent-return */
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import fs from 'fs';
import { ProtoGrpcType } from './proto/storage-node';

const protoFile = path.join(__dirname, '../../assets', 'storage-node.proto');
const f = fs.readFileSync(protoFile);
const t = f.toString('utf-8');
console.log('GProto');
console.log(t.slice(0, 100));
const pkgDef = protoLoader.loadSync(protoFile);

const proto = grpc.loadPackageDefinition(pkgDef) as unknown as ProtoGrpcType;

const NodeAPI = {
  GetStats(host: string): Promise<{ freeStorage: number; latency: number }> {
    const client = new proto.proto.StorageNode(
      host,
      grpc.credentials.createInsecure()
    );
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
