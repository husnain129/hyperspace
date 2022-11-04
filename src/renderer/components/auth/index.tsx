import { Button, HStack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <VStack w="full" alignItems="flex-start">
      <Text fontSize="1.4em" fontWeight="semibold">
        Welcome to HyperSpace
      </Text>
      <Text color="#9B9B9B">Let’s start by configuring your account. </Text>
      <HStack pt="4em">
        <Button onClick={() => navigate('/new')} colorScheme="primary">
          Creata a new account
        </Button>
        <Button
          onClick={() => navigate('/already_have_account')}
          variant="outline"
          outline="1px solid #4859a0"
        >
          Load existing account
        </Button>
      </HStack>
    </VStack>
  );
};

export default Auth;
