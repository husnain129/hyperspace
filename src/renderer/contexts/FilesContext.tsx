/* eslint-disable promise/catch-or-return */
/* eslint-disable promise/no-nesting */
import { ethers } from 'ethers';
import type { IPCcontractConcludeTx } from 'main/main';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { FileStatus, IFile } from 'main/IFile';
// eslint-disable-next-line import/no-cycle
import useAccount from 'renderer/hooks/useAccount';
import toast from 'react-hot-toast';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { BiDownload } from 'react-icons/bi';
import { MdDownloadForOffline } from 'react-icons/md';

interface IFilesContext {
  files: IFile[];
  isLoading: boolean;
  uploadFile: (args: UploadFileArgs) => Promise<string>;
  downloadFile: (fileKey: string, decKey: string) => Promise<string>;
  abortDownload: (fileKey: string) => Promise<void>;
  reloadFiles: () => void;
  encryptFile: (
    filePath: string,
    dest: string,
    key: string
  ) => Promise<{ path: string; size: number; sha256: string }>;

  computeMerkleRootHash: (
    filePath: string,
    segments: number
  ) => Promise<string>;
}

export function computeFileKey(
  userAddress: string,
  fileMerkleRootHash: string
) {
  const s = ethers.utils.defaultAbiCoder.encode(
    ['address', 'bytes32'],
    [userAddress, `0x${fileMerkleRootHash}`]
  );
  console.log(s);
  return ethers.utils.solidityKeccak256(['bytes'], [s]).slice(2); // omit 0x
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
  encrypted: boolean;
  sha256: string;
}
export interface UploadFileCallbacks {
  onUploadProgress: (p: number) => void;
  onUploadComplete: () => void;
  onConcludeComplete: () => void;
  onError: (err: string) => void;
}
export default function FilesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [files, setFiles] = useState<IFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadCallbacks, setUploadCallbacks] = useState<
    Array<{ fileKey: string; cbs: UploadFileCallbacks }>
  >([]);
  const { account } = useAccount();

  const computeRootHash = async (filePath: string, segmentsCount: number) => {
    const hash: string = await window.electron.ipcRenderer.invoke(
      'node-compute-hash',
      {
        filePath,
        segmentsCount,
      }
    );
    return hash;
  };
  const encryptFile = async (filePath: string, dest: string, key: string) => {
    const res = await window.electron.ipcRenderer.invoke('encrypt-file', {
      filePath,
      key,
      dest,
    });
    return { path: res.path, size: res.size, sha256: res.sha256 };
  };

  /**
   * Returns fileKey
   */
  const uploadFile = useCallback(
    async (args: UploadFileArgs, callbacks?: UploadFileCallbacks) => {
      // console.log('hash:', hash);
      // eslint-disable-next-line no-undef-init
      // let unregisterCallbacks: () => void | undefined = undefined;
      // if (callbacks) {
      //   setUploadCallbacks((c) => {
      //     unregisterCallbacks = () => {
      //       setUploadCallbacks((cbs) => cbs.filter((_, i) => i !== c.length));
      //     };
      //     return c.concat({ fileKey: args.merkleRootHash, cbs: callbacks });
      //   });
      // }
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
      console.log(`File Key: ${fileKey}`);
      let p = args.filePath.split(/[\\/]/).pop();
      if (args.encrypted) p = p?.slice(0, -4); // remove enc
      setFiles((f) =>
        f.concat([
          {
            fileKey,
            name: p || args.filePath || 'NA',
            status: FileStatus.UPLOADING,
            bid: args.bid,
            fileMerkleRootHash: args.merkleRootHash,
            lastVerified: 0,
            progress: 0,
            sha256: args.sha256,
            storageContractAddress: args.storageNodeAddress,
            timeCreated: Math.floor(Date.now() / 1000),
            segmentsCount: args.segmentsCount,
            timerEnd: args.timeEnd,
            timerStart: args.timeStart,
            fileSize: args.fileSize,
            concludeTimeoutLength: 60 * 60 * 60,
            proveTimeoutLength: 30,
            isEncrypted: args.encrypted,
            downloadURL: '',
          },
        ])
      );

      const { download_url: downloadURL } =
        await window.electron.ipcRenderer.invoke('node-http-upload', {
          url: httpURL,
          filePath: args.filePath,
          token,
          fileKey,
        });

      console.log('Key:', fileKey);
      console.log('download_url:', downloadURL);

      return fileKey;
    },
    [account.address]
  );
  const abortDownload = useCallback(async (fileKey: string) => {
    const fIndex = files.findIndex((f) => f.fileKey === fileKey);
    if (fIndex < 0) {
      return;
    }
    const file = files[fIndex];
    if (file.status === FileStatus.DOWNLOADING) {
      const success = await window.electron.ipcRenderer.invoke(
        'node-http-download-abort',
        {
          fileKey,
        }
      );
      if (success) {
        setFiles((f) =>
          f.map((fl) =>
            fl.fileKey !== fileKey
              ? fl
              : { ...fl, status: FileStatus.IDLE, progress: 0 }
          )
        );
      }
    }
  }, []);
  const downloadFile = useCallback(
    async (fileKey: string, decKey: string): Promise<string> => {
      const fIndex = files.findIndex((f) => f.fileKey === fileKey);
      if (fIndex < 0) throw new Error("file doesn't exists");
      const file = files[fIndex];
      if (file.status !== FileStatus.IDLE) {
        throw new Error('file is busy');
      }
      try {
        setFiles((f) =>
          f.map((fl) =>
            fl.fileKey !== fileKey
              ? fl
              : { ...fl, status: FileStatus.DOWNLOADING, progress: 0 }
          )
        );

        // console.log('>fetching stats');
        // const storageContract = await window.electron.ipcRenderer.invoke(
        //   'node-contract-info',
        //   file.storageContractAddress
        // );
        // console.log('>Contract: ', storageContract);
        // let { host }: { host: string } = storageContract;
        // console.log('>URL', host);
        // host = host.replace('8000', '5555');
        const { dest } = await window.electron.ipcRenderer.invoke(
          'node-http-download',
          {
            url: file.downloadURL,
            token: '',
            name: file.name,
            fileKey,
            sha256: file.sha256,
            decrypt: file.isEncrypted
              ? {
                  key: decKey,
                }
              : undefined,
          }
        );
        console.log('>DEST:', dest);
      } catch (er) {
        setFiles((f) =>
          f.map((fl) =>
            fl.fileKey !== fileKey
              ? fl
              : { ...fl, status: FileStatus.IDLE, progress: 0 }
          )
        );
      }
      return fileKey;
    },

    [files]
  );

  const reloadFiles = useCallback(() => {
    console.log('Getting files');
    setIsLoading(false);

    window.electron.ipcRenderer
      .invoke('get-all-files')
      .then((f: IFile[]) => {
        setFiles(f);
        // console.log('>Files');
        // console.log(f);
      })
      .catch((er) => {
        console.warn('failed to get files');
        console.warn(er);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    reloadFiles();
  }, [reloadFiles, account]);

  useEffect(() => {
    const unsubProgress = window.electron.ipcRenderer.on(
      'file-progress',
      ({ fileKey: fk, progress }: any) => {
        if (fk) {
          setFiles((f) =>
            f.map((file) =>
              file.fileKey !== fk ? file : { ...file, progress }
            )
          );
        }
      }
    );

    const unsubFileError = window.electron.ipcRenderer.on(
      'file-error',

      ({ fileKey, operation }: any) => {
        if (operation === 'UPLOAD') {
          // upload failed
          setFiles((_files) => _files.filter((f, i) => f.fileKey !== fileKey));
        } else if (operation === 'DOWNLOAD') {
          toast.error('Something went wrong. Please try again.');
          setFiles((f) =>
            f.map((fl) =>
              fl.fileKey !== fileKey
                ? fl
                : { ...fl, status: FileStatus.IDLE, progress: 0 }
            )
          );
        }
      }
    );

    const unsubUploadComplete = window.electron.ipcRenderer.on(
      'file-complete',
      ({ fileKey, download_url, ...args }: any) => {
        if (fileKey) {
          // conclude file
          const fileIndex = files.findIndex((f) => f.fileKey === fileKey);
          if (fileIndex < 0) {
            console.warn('unexpected event: file-complete fileKey:', fileKey);
            return;
          }
          const file = files[fileIndex];

          if (file.status === FileStatus.UPLOADING) {
            const params: IPCcontractConcludeTx = {
              fileKey: file.fileKey,
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
            console.log('Setting download URL: ', download_url);

            setFiles((_files) =>
              _files.map((f, i) =>
                i !== fileIndex
                  ? f
                  : {
                      ...f,
                      downloadURL: download_url,
                      status: FileStatus.CONCLUDING,
                    }
              )
            );
            setTimeout(() => {
              // settle delay
              window.electron.ipcRenderer
                .invoke('contract-conclude-tx', params)
                .then(() => {
                  console.log('>Concluded file: ', fileKey);

                  setFiles((_files) =>
                    _files.map((f, i) =>
                      i !== fileIndex ? f : { ...f, status: FileStatus.IDLE }
                    )
                  );
                  window.electron.ipcRenderer
                    .invoke('db-insert-file', {
                      ...file,
                      downloadURL: download_url,
                    })
                    .then(() => {
                      console.log('insert complete');
                    })
                    .catch((er) => {
                      console.log('insertion error');
                      console.warn(er);
                      window.electron.ipcRenderer.sendMessage('file-error', [
                        {
                          fileKey,
                          operation: 'UPLOAD',
                        },
                      ]);
                    });
                })

                .catch((er) => {
                  setFiles((_files) =>
                    _files.filter((f, i) => i !== fileIndex)
                  );
                  toast.error('Failed to upload. Please try again');
                  console.warn(er);
                });
            }, 2000);
          } else if (file.status === FileStatus.DOWNLOADING) {
            setTimeout(() => {
              // delay for humans -_-
              toast(
                (t: any) => (
                  <HStack>
                    <MdDownloadForOffline
                      fontSize="1.5rem"
                      color="var(--chakra-colors-primary-400)"
                    />
                    <Text fontSize="sm" fontWeight="500">
                      Download Complete
                    </Text>
                    <Box h="18px" w="1px" bg="gray.300" />
                    <Button
                      size="sm"
                      // variant="ghost"
                      onClick={() => {
                        window.electron.ipcRenderer.invoke(
                          'open-finder',
                          args.dest
                        );
                        toast.dismiss(t.id);
                      }}
                      colorScheme="primary"
                      borderRadius="4px"
                      p="0px 8px"
                      minH="auto"
                      height="28px"
                      // color="#555"
                    >
                      Open
                    </Button>
                  </HStack>
                ),
                { duration: 5000 }
              );
              setFiles((_files) =>
                _files.map((f, i) =>
                  f.fileKey !== fileKey
                    ? f
                    : { ...f, status: FileStatus.IDLE, progress: 0 }
                )
              );
            }, 1000);
          }
        }
      }
    );

    return () => {
      if (unsubUploadComplete) unsubUploadComplete();
      if (unsubProgress) unsubProgress();
      if (unsubFileError) unsubFileError();
    };
  }, [files, account]);

  return (
    <FilesContext.Provider
      value={{
        files,
        isLoading,
        uploadFile,
        computeMerkleRootHash: computeRootHash,
        downloadFile,
        abortDownload,
        encryptFile,
        reloadFiles,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
}
