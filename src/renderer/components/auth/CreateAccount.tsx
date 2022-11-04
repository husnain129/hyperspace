/* eslint-disable react/no-children-prop */
import { Button, Flex, Input, Text, VStack } from '@chakra-ui/react';
import { BsChevronRight } from 'react-icons/bs';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
  const navigate = useNavigate();
  return (
    <VStack
      w="full"
      alignItems="flex-start"
      h="full"
      justifyContent="space-between"
    >
      <VStack w="full" alignItems="flex-start">
        <Text fontSize="1.5em" fontWeight="semibold">
          {' '}
          What should we call you?
        </Text>
        <VStack pt="2em" gap=".2em" w="full" alignItems="flex-start">
          <Input placeholder="Enter your name" />
          <Button
            onClick={() => navigate('/')}
            colorScheme="primary"
            rightIcon={<BsChevronRight />}
          >
            Next
          </Button>
        </VStack>
      </VStack>
      <Flex
        gap=".2em"
        cursor="pointer"
        alignItems="center"
        justifyContent="center"
        onClick={() => navigate(-1)}
      >
        <FiChevronLeft />
        <Text>Back</Text>
      </Flex>
    </VStack>
  );
};

export default CreateAccount;
