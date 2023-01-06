export enum FileStatus {
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
  name: string;
  fileMerkleRootHash: string;
  segmentsCount: number;
  timerStart: number;
  timerEnd: number;
  timeCreated: number;
  lastVerified: number;
  concludeTimeoutLength: number;
  proveTimeoutLength: number;
  sha256: string;
  isEncrypted: boolean;
}
