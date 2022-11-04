import { Center, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import hyperspace from '../../../assets/hyperspace.svg';
import hyperspace_white from '../../../assets/hyperspace_white.svg';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w="100vw" h="100vh">
      <VStack gap="6em" p="2em 3em" alignItems="flex-start" w="50%">
        <HStack alignItems="center">
          <Image src={hyperspace} alt="logo" w="3.1em" h="3.1em" />
          <Text fontSize="1.1em" fontWeight="semibold">
            HYPER<span style={{ color: '#7D7D7D' }}>SPACE</span>
          </Text>
        </HStack>
        {children}
      </VStack>
      <Center w="50%" h="full" bg="#141D41">
        <Image src={hyperspace_white} alt="logo" w="10em" h="10em" />
      </Center>
    </Flex>
  );
};

export default AuthLayout;
