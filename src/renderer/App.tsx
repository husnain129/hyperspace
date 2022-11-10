/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/jsx-curly-brace-presence */
import { Center, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import {
  MemoryRouter as Router,
  Route,
  Routes,
  useNavigate,
} from 'react-router-dom';
import './App.css';
import Auth from './components/auth';
import AlreadyHaveAnAccount from './components/auth/AlreadyHaveAnAccount';
import CreateAccount from './components/auth/CreateAccount';
import FileContainer from './components/file';
import Nodes from './components/nodes/nodes';
import Loading from './components/loading/loading';
import Layout from './layout';
import AuthLayout from './layout/AuthLayout';
import type { IAccount } from '../main/db-api';
import AccountContextProvider from './contexts/AccountContext';

const Hello = () => {
  return (
    <Center w="100%" h="full">
      <Text>Hello world</Text>
    </Center>
  );
};

async function getAccount(): Promise<IAccount> {
  try {
    const account = await window.electron.ipcRenderer.invoke('get-account');
    return account;
  } catch (er) {
    console.warn(er);
    throw er;
  }
}
export default function App() {
  // window.electron.ipcRenderer.once('createNewUserFile', (arg) => {
  //   // eslint-disable-next-line no-console
  //   console.log('husnain - arg', arg);
  // });
  // window.electron.ipcRenderer.sendMessage('createNewUserFile', {
  //   username: 'husnain',
  // });
  const navigate = useNavigate();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [accountLoading, setAccountLoading] = useState(true);
  useEffect(() => {
    setAccountLoading(true);
    getAccount()
      .then((acc) => {
        console.log('Got account:', acc);
        if (acc) setAccount(acc);
        else throw new Error('nil accont was provided');
      })
      .catch((er: Error) => {
        console.log(er);

        navigate('/auth');
      })
      .finally(() => {
        setAccountLoading(false);
      });
  }, []);

  const ProtectedRoute: React.FunctionComponent<{
    children: React.ReactElement;
  }> = (props) => {
    return accountLoading || !account ? (
      <Loading />
    ) : (
      <AccountContextProvider account={account} setAccount={setAccount}>
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.children}
      </AccountContextProvider>
    );
  };
  return (
    <Routes>
      <Route
        path="/auth/*"
        element={
          <Auth
            onAccountLoaded={(acc) => {
              setAccountLoading(false);
              setAccount(acc);
              navigate('/');
            }}
          />
        }
      />
      <Route
        path="/nodes"
        element={
          <ProtectedRoute>
            <Layout>
              <Nodes />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <FileContainer />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
