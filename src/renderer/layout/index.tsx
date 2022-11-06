import { Flex } from '@chakra-ui/react';
import React from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w="100vw" h="100vh" flexDir="column">
      <Navbar />
      <Flex w="full" h="full">
        <Sidebar />
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
