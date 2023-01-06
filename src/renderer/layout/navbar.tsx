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

const Navbar = (props: { onUploadClick: () => void; isUploading: boolean }) => {
  return (
    <HStack
      className="draggable-region"
      w="100vw"
      h="65px"
      flexShrink={0}
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
        {/* <IconButton
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
        /> */}
        <Button
          px="1.1em"
          borderRadius="30px"
          // py="1em"
          size="sm"
          leftIcon={<FiUpload />}
          colorScheme="primary"
          isLoading={props.isUploading}
          onClick={props.onUploadClick}
        >
          Upload
        </Button>
      </HStack>
    </HStack>
  );
};

// UploadFile

export default Navbar;
