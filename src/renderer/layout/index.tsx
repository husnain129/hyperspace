import { Flex } from '@chakra-ui/react';
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from './navbar';
import Sidebar, { NAVIGATION } from './sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const n = useLocation();
  // console.log('N', n);

  return (
    <Flex w="100vw" h="100vh" flexDir="column">
      <Navbar />
      <Flex w="full" h="full">
        <Sidebar
          activeNavigation={
            {
              '/': NAVIGATION.DASHBOARD,
              '/nodes': NAVIGATION.NODES,
              '/account': NAVIGATION.ACCOUNT,
            }[n.pathname] as NAVIGATION
          }
        />
        {children}
      </Flex>
    </Flex>
  );
};

export default Layout;
