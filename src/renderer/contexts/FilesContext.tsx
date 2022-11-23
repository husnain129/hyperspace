import { ethers } from 'ethers';
import { IAccount } from 'main/db-api';
import { IPCcontractConcludeTx } from 'main/main';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import useAccount from 'renderer/hooks/useAccount';

enum FileStatus {
  CONCLUDING,
  UPLOADING,
  DOWNLOADING,
  IDLE,
}

export interface IFile {
  status: FileStatus;
  fileKey: string;
  progress: number;
  storageContractAddress: string;
  bid: string;
  fileSize: number;

  fileMerkleRootHash: string;
  segmentsCount: number;
  timerStart: number;
  timerEnd: number;
  timeCreated: number;
  lastVerified: number;
  concludeTimeoutLength: number;
  proveTimeoutLength: number;
  sha256: string;
}

interface IFilesContext {
  files: IFile[];
  isLoading: boolean;
  uploadFile: (args: UploadFileArgs) => Promise<string>;
  computeMerkleRootHash: (filePath: string) => Promise<string>;
}
export function computeFileKey(
  userAddress: string,
  fileMerkleRootHash: string
) {
  const s = ethers.utils.solidityPack(
    ['address', 'bytes32'],
    [userAddress, `0x${fileMerkleRootHash}`]
  );
  return ethers.utils.solidityKeccak256(['bytes'], [s]);
}

export const FilesContext = createContext<IFilesContext>(
  {} as unknown as IFilesContext
);
interface UploadFileArgs {
  host: string;
  filePath: string;
  fileSize: number;
  timeStart: number;
  timeEnd: number;
  segmentsCount: number;
  bid: string;
  merkleRootHash: string;
  storageNodeAddress: string;
}

export default function FilesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState<IFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useAccount();

  const computeRootHash = async (filePath: string) => {
    const hash: string = await window.electron.ipcRenderer.invoke(
      'node-compute-hash',
      {
        filePath,
        segmentsCount: 1000,
      }
    );
    return hash;
  };

  /**
   * Returns fileKey
   */
  const uploadFile = useCallback(
    async (args: UploadFileArgs) => {
      // console.log('hash:', hash);

      const { jwt: token, httpURL }: { jwt: string; httpURL: string } =
        await window.electron.ipcRenderer.invoke('node-init-tx', {
          userAddress: account.address,
          host: args.host,
          fileSize: args.fileSize,
          timeStart: args.timeStart,
          timeEnd: args.timeEnd,
          segmentsCount: args.segmentsCount,
          fileHash: args.merkleRootHash,
          bid: args.bid,
        });
      console.log('Token:', token);
      const fileKey = computeFileKey(account.address, args.merkleRootHash);

      setFiles((f) =>
        f.concat([
          {
            fileKey,
            status: FileStatus.UPLOADING,
            bid: args.bid,
            fileMerkleRootHash: args.merkleRootHash,
            lastVerified: 0,
            progress: 0,
            sha256: '',
            storageContractAddress: args.storageNodeAddress,
            timeCreated: Date.now() / 100,
            segmentsCount: args.segmentsCount,
            timerEnd: args.timeEnd,
            timerStart: args.timeStart,
            fileSize: args.fileSize,
            concludeTimeoutLength: 30,
            proveTimeoutLength: 30,
          },
        ])
      );

      await window.electron.ipcRenderer.invoke('node-http-upload', {
        url: httpURL,
        filePath: args.filePath,
        token,
        fileKey,
      });

      console.log('Key:', fileKey);
      return fileKey;
    },
    [account.address]
  );

  useEffect(() => {
    setIsLoading(false);
  }, []);
  useEffect(() => {
    const unsubUploadComplete = window.electron.ipcRenderer.on(
      'file-complete',
      ({ fileKey }: any) => {
        if (fileKey) {
          // conclude file
          const fileIndex = files.findIndex((f) => f.fileKey === fileKey);
          if (fileIndex < 0) {
            console.warn('Unknown event: file-complete fileKey:', fileKey);
            return;
          }
          const file = files[fileIndex];

          const params: IPCcontractConcludeTx = {
            weiValue: file.bid,
            bidAmount: file.bid,
            fileSize: file.fileSize,
            concludeTimeoutLength: file.concludeTimeoutLength,
            contractAddress: file.storageContractAddress,
            merkleRootHash: file.fileMerkleRootHash,
            privateKey: account.private_key,
            proveTimeoutLength: file.proveTimeoutLength,
            segmentsCount: file.segmentsCount,
            timerEnd: file.timerEnd,
            timerStart: file.timerStart,
            userAddress: account.address,
          };
          window.electron.ipcRenderer
            .invoke('contract-conclude-tx', params)
            .then(() => {
              console.log('>Conclude file: ', fileKey);
              setFiles((_files) =>
                _files.map((f, i) =>
                  i !== fileIndex ? f : { ...f, status: FileStatus.CONCLUDING }
                )
              );
            })

            .catch((er) => {
              setFiles((_files) => _files.filter((f, i) => i !== fileIndex));

              console.warn(er);
            });

          setFiles((_files) =>
            _files.map((f, i) =>
              i !== fileIndex ? f : { ...f, status: FileStatus.CONCLUDING }
            )
          );
        }
      }
    );

    return () => {
      if (unsubUploadComplete) unsubUploadComplete();
    };
  }, [files, account]);

  return (
    <FilesContext.Provider
      value={{
        files,
        isLoading,
        uploadFile,
        computeMerkleRootHash: computeRootHash,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}
