import {
  Button,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Text,
} from '@chakra-ui/react';
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
      h="65px"
      borderBottom="1px solid #F2F2F2 "
      alignItems="center"
      px="2em"
      justifyContent="space-between"
    >
      <Flex gap=".4em" justifyContent="center" alignItems="center">
        <Image src={hyperspace} alt="logo" h="2rem" />
      </Flex>
      <HStack gap=".5em">
        <IconButton
          border="1px solid"
          size="sm"
          borderColor="gray.400"
          borderRadius="full"
          variant="ghost"
          icon={<TbDownload />}
          aria-label="download and upload progress"
        />
        <Button
          borderRadius="3xl"
          size="sm"
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
