/* eslint-disable react/destructuring-assignment */
import { Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { IAccount } from 'main/db-api';
import {
  MemoryRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import AuthLayout from 'renderer/layout/AuthLayout';
import AlreadyHaveAnAccount from './AlreadyHaveAnAccount';
import CreateAccount from './CreateAccount';

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
        marginTop="-2rem"
      >
        <Text fontSize="1.6em" fontWeight="black">
          Welcome to Hyperspace
        </Text>
        <Flex gap="1.4em" flexDir="column">
          <Text color="#9B9B9B" fontSize="1em" fontWeight="semibold">
            Let’s start by configuring your account.
          </Text>
          <HStack>
            <Button
              onClick={() => navigate('/auth/new-account')}
              colorScheme="primary"
            >
              Creata a new account
            </Button>
            <Button
              onClick={() => navigate('/auth/load-account')}
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

export default function Index(props: {
  onAccountLoaded: (account: IAccount) => void;
}) {
  return (
    <Routes>
      <Route
        path="/new-account"
        element={
          <AuthLayout>
            <CreateAccount
              onAccountCreated={(account: IAccount) =>
                props.onAccountLoaded(account)
              }
            />
          </AuthLayout>
        }
      />
      <Route
        path="/load-account"
        element={
          <AuthLayout>
            <AlreadyHaveAnAccount />
          </AuthLayout>
        }
      />
      <Route
        path="/"
        element={
          <AuthLayout>
            <Auth />
          </AuthLayout>
        }
      />
    </Routes>
  );
}
