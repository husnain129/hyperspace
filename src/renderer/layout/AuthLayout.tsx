import { Center, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import hyperspace from '../../../assets/hyperspace.svg';
import hyperspace_white from '../../../assets/hyperspace_white.svg';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex w="100vw" h="100vh" className="draggable-region">
      <VStack gap="1em" p="2em 3em" alignItems="flex-start" w="50%">
        {/* <HStack alignItems="center" mt="1.5rem">
          <Image src={hyperspace} alt="logo" h="2.2rem" />
        </HStack> */}
        {children}
      </VStack>
      <Center w="50%" h="full" bg="#141D41">
        <VStack spacing={5}>
          <Image src={hyperspace_white} alt="logo" w="10em" h="10em" />
          <Text
            color="white"
            fontWeight={'600'}
            fontSize="30px"
            display={'flex'}
            gap="2px"
            letterSpacing={'2px'}
          >
            <Text color="gray.500">HYPER</Text>SPACE
          </Text>
        </VStack>
      </Center>
    </Flex>
  );
};

export default AuthLayout;
