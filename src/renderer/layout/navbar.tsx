import { Flex, HStack, Image, Text } from '@chakra-ui/react';
import hyperspace from '../../../assets/hyperspace.svg';

const Navbar = () => {
  return (
    <HStack
      w="100vw"
      h="11vh"
      borderBottom="1px solid #F2F2F2 "
      alignItems="center"
      px="1.5em"
    >
      <Image src={hyperspace} alt="logo" w="2.5em" h="2.5em" />
      <Flex
        flexDir="column"
        justifyContent="flex-start"
        alignItems="flex-start"
      >
        <Text fontWeight="semibold">
          HYPER<span style={{ color: '#7D7D7D' }}>SPACE</span>
        </Text>
      </Flex>
    </HStack>
  );
};

export default Navbar;
