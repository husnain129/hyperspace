import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

function GenericModal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent minW="max-content" minH="max-content">
          <ModalHeader fontSize={'md'} fontWeight="black">
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody w="max-content" h="max-content">
            {children}
          </ModalBody>
          <ModalFooter>
            {
              <HStack>
                <Button colorScheme={'primary'} h="2rem">
                  Upload
                </Button>
                <Button
                  my="0.3em"
                  colorScheme="gray"
                  variant="ghost"
                  // py="0.1em"
                  borderRadius={'4px'}
                  h="2rem"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </HStack>
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GenericModal;
