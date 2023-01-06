import { Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import UploadFile from 'renderer/components/file/UploadFile';
import GenericModal from 'renderer/components/utils/GenericModal';
import Navbar from './navbar';
import Sidebar, { NAVIGATION } from './sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const n = useLocation();
  // console.log('N', n);
  const [showModal, setShowModal] = useState(false);
  const [isUploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    path: string;
    size: number;
    ext: string;
    name: string;
  } | null>(null);
  const handleUploadClick = async () => {
    setUploading(true);
    const file = await window.electron.ipcRenderer.invoke('browse-file');
    console.log(file);

    setUploading(false);
    if (file != null) {
      setSelectedFile(file);
      setShowModal(true);
    }
  };
  useEffect(() => {
    console.log('Reg');
    window.electron.ipcRenderer.on('upload-click', () => {
      handleUploadClick();
      console.log('click');
    });
  }, []);

  return (
    <Flex w="100vw" h="100vh" flexDir="column">
      <Navbar onUploadClick={handleUploadClick} isUploading={isUploading} />
      <Flex w="full" h="full">
        <Sidebar
          activeNavigation={
            {
              '/': NAVIGATION.DASHBOARD,
              '/nodes': NAVIGATION.NODES,
              '/account': NAVIGATION.ACCOUNT,
            }[n.pathname] as NAVIGATION
          }
        />
        <Flex
          w="full"
          flexDir={'column'}
          maxH={'calc(100vh - 65px)'}
          overflow="auto"
        >
          {children}
        </Flex>
      </Flex>
      {selectedFile && showModal && (
        <GenericModal
          isOpen
          onClose={() => setShowModal(false)}
          title="Upload File"
        >
          <UploadFile
            onClose={() => {
              setSelectedFile(null);
              setShowModal(false);
            }}
            path={selectedFile?.path}
            ext={selectedFile?.ext}
            name={selectedFile?.name}
            size={selectedFile?.size}
          />
        </GenericModal>
      )}
    </Flex>
  );
};

export default Layout;
