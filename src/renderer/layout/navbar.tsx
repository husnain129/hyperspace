import { Button, Center, Flex, HStack, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { TbDownload } from 'react-icons/tb';
import UploadFile from 'renderer/components/file/UploadFile';
import GenericModal from 'renderer/components/utils/GenericModal';
import hyperspace from '../../../assets/hyperspace.svg';

const Navbar = () => {
  const [updaloadFile, setUpdaloadFile] = useState(false);
  return (
    <HStack
      w="100vw"
      h="11vh"
      borderBottom="1px solid #F2F2F2 "
      alignItems="center"
      px="1.5em"
      justifyContent="space-between"
    >
      <Flex gap=".4em" justifyContent="center" alignItems="center">
        <Image src={hyperspace} alt="logo" w="2.5em" h="2.5em" />
        <Text fontWeight="semibold">
          HYPER<span style={{ color: '#7D7D7D' }}>SPACE</span>
        </Text>
      </Flex>
      <HStack gap=".5em">
        <Center w="2em" h="2em" borderRadius="full" border="1px solid #0f0f0f">
          <TbDownload />
        </Center>
        <Button
          borderRadius="3xl"
          leftIcon={<FiUpload />}
          colorScheme="primary"
          onClick={() => setUpdaloadFile(true)}
        >
          Upload
        </Button>
      </HStack>
      <GenericModal
        isOpen={updaloadFile}
        onClose={() => setUpdaloadFile(false)}
        title="Upload File"
      >
        <UploadFile />
      </GenericModal>
    </HStack>
  );
};

// UploadFile

export default Navbar;
