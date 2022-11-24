import { useContext } from 'react';
import { FilesContext } from 'renderer/contexts/FilesContext';

export default function useFiles() {
  const { files, isLoading, uploadFile, computeMerkleRootHash, downloadFile } =
    useContext(FilesContext);

  return {
    files,
    isLoading,
    uploadFile,
    computeMerkleRootHash,
    downloadFile,
  };
}
