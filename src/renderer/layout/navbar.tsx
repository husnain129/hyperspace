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
      className="draggable-region"
      w="100vw"
      h="65px"
      borderBottom="1px solid #F2F2F2 "
      alignItems="center"
      px="2em"
      // bg="#fafafa"
      justifyContent="space-between"
    >
      <Flex gap=".4em" justifyContent="center" alignItems="center">
        {/* <Image src={hyperspace} alt="logo" h="2rem" /> */}
      </Flex>
      <HStack gap=".5em">
        <IconButton
          border="1px solid"
          size="sm"
          // h="1.8rem"
          // minW="1.8rem"
          borderColor="gray.200"
          // borderColor="#0000"
          borderRadius="full"
          variant="ghost"
          icon={<TbDownload />}
          aria-label="download and upload progress"
        />
        <Button
          px="1em"
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
