import { Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <VStack w="full" alignItems="flex-start" h="full" justify="start">
      <VStack
        w="full"
        align="flex-start"
        alignSelf="center"
        justify="center"
        flex={1}
        gap="2em"
        marginTop="-7rem"
      >
        <Text fontSize="1.6em" fontWeight="black">
          Welcome to HyperSpace
        </Text>
        <Flex gap="1.4em" flexDir="column">
          <Text color="#9B9B9B" fontSize="1em" fontWeight="semibold">
            Let’s start by configuring your account.
          </Text>
          <HStack>
            <Button onClick={() => navigate('/new')} colorScheme="primary">
              Creata a new account
            </Button>
            <Button
              onClick={() => navigate('/already_have_account')}
              variant="ghost"
              outline="1px solid #4859a0"
            >
              Load existing account
            </Button>
          </HStack>
        </Flex>
      </VStack>
    </VStack>
  );
};

export default Auth;
