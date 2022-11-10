/* eslint-disable no-nested-ternary */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
import {
  Circle,
  Flex,
  Heading,
  Link,
  Skeleton,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
// import { ipcRenderer } from 'electron';
// import { ipcRenderer } from 'electron';
import { useEffect, useState } from 'react';
import prettyBytes from 'pretty-bytes';
import BladeSpinner from '../blade-spinner/BladeSpinner';
import useAccount from '../../hooks/useAccount';

export default function Account() {
  const [loading, setLoading] = useState(false);
  const { account } = useAccount();
  return (
    <Flex w="full" flexDir="column" p="2em">
      <Heading size="md" mb="1.5rem" color="gray.700">
        Account
      </Heading>
      <Flex flexDir="column" fontFamily="mono" gap="0.5rem">
        <Text>Name: {account.name}</Text>
        <Text>Address: {account.address}</Text>
        <Text wordBreak="break-all">Public Key: {account.public_key}</Text>
        <Text wordBreak="break-all">Private Key: {account.private_key}</Text>
      </Flex>
    </Flex>
  );
}
