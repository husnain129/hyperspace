import { Flex, Spinner, Image, Box, Text } from '@chakra-ui/react';
import BladeSpinner from '../blade-spinner/BladeSpinner';
import hyperspace from '../../../../assets/hyperspace_white.svg';

export default function Welcome() {
  return (
    <Flex w="100vw" h="100vh" bg="primary.700" align="center" justify="center">
      <Flex flexDir="column" gap="0rem" align="center">
        <Box position="relative">
          <BladeSpinner />
        </Box>
        <Text fontWeight="semibold" color="primary.100">
          Just a moment
        </Text>
      </Flex>
    </Flex>
  );
}
