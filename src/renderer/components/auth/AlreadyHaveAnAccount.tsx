import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { BsChevronRight } from 'react-icons/bs';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AlreadyHaveAnAccount = () => {
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
          Select your account file
        </Text>
        <VStack pt="2em" gap=".2em" w="full" alignItems="flex-start">
          <Button variant="outline" outline="1px solid #4859a0" w="12em">
            Browse
          </Button>
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

export default AlreadyHaveAnAccount;
