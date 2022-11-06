/* eslint-disable react/jsx-curly-brace-presence */
import { Center, HStack, Text } from '@chakra-ui/react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Auth from './components/auth';
import AlreadyHaveAnAccount from './components/auth/AlreadyHaveAnAccount';
import CreateAccount from './components/auth/CreateAccount';
import AuthLayout from './layout/AuthLayout';
import Sidebar from './layout/sidebar';

const Hello = () => {
  return (
    <HStack
      bg={'#F5F5F5'}
      w="100vw"
      h="100vh"
      p="1.5em 1em"
      alignItems="center"
      justifyContent="space-between"
    >
      <Sidebar />
      <Center w="75%" h="full">
        <Text>Hello world</Text>
      </Center>
    </HStack>
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
        <Route path="/" element={<Hello />} />
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
      </Routes>
    </Router>
  );
}
