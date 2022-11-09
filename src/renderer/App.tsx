/* eslint-disable react/jsx-curly-brace-presence */
import { Center, Text } from '@chakra-ui/react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './components/auth';
import AlreadyHaveAnAccount from './components/auth/AlreadyHaveAnAccount';
import CreateAccount from './components/auth/CreateAccount';
import FileContainer from './components/file';
import Nodes from './components/nodes/nodes';
import Layout from './layout';
import AuthLayout from './layout/AuthLayout';

const Hello = () => {
  return (
    <Center w="100%" h="full">
      <Text>Hello world</Text>
    </Center>
  );
};

export default function App() {
  // window.electron.ipcRenderer.once('createNewUserFile', (arg) => {
  //   // eslint-disable-next-line no-console
  //   console.log('husnain - arg', arg);
  // });
  // window.electron.ipcRenderer.sendMessage('createNewUserFile', {
  //   username: 'husnain',
  // });

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthLayout>
              <Auth />
            </AuthLayout>
          }
        />
        <Route
          path="/new"
          element={
            <AuthLayout>
              <CreateAccount />
            </AuthLayout>
          }
        />
        <Route
          path="/already_have_account"
          element={
            <AuthLayout>
              <AlreadyHaveAnAccount />
            </AuthLayout>
          }
        />
        <Route
          path="/nodes"
          element={
            <Layout>
              <Nodes />
            </Layout>
          }
        />
        <Route
          path="/"
          element={
            <Layout>
              <FileContainer />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
