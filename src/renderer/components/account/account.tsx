/* eslint-disable no-nested-ternary */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
import {
  Button,
  Circle,
  Flex,
  Heading,
  HStack,
  Link,
  Skeleton,
  Spinner,
  Table,
  TableContainer,
  Tag,
  TagLabel,
  TagLeftIcon,
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
import { BsExclamation, BsExclamationCircle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { BiRadar } from 'react-icons/bi';
import BladeSpinner from '../blade-spinner/BladeSpinner';
import useAccount from '../../hooks/useAccount';

export default function Account() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { account, setAccount } = useAccount();
  const handleExportAccount = () => {
    window.electron.ipcRenderer.invoke('export-account', account.name);
  };
  const handleRemoveAccount = async () => {
    const r = await window.electron.ipcRenderer.invoke('remove-account');
    if (r) {
      setAccount(null as any);

      navigate('/auth');
    }
  };
  return (
    <Flex w="full" flexDir="column" p="2em" align="flex-start">
      <HStack justify="space-between" align="center" w="full">
        <Heading size="md" color="gray.700">
          Account
        </Heading>

        <HStack>
          <Button
            variant="ghost"
            borderRadius="4px"
            colorScheme="red"
            size="sm"
            onClick={handleRemoveAccount}
          >
            Remove Account
          </Button>
          <Button
            variant="outline"
            borderRadius="4px"
            colorScheme="primary"
            size="sm"
            onClick={handleExportAccount}
          >
            Export Account
          </Button>
        </HStack>
      </HStack>
      <Button
        mt="0.8em"
        variant="link"
        leftIcon={<BiRadar fontSize="1.2em" />}
        size="sm"
        href={`https://goerli-optimism.etherscan.io/address/${account.address}`}
        as="a"
        target="_blank"
      >
        Check on EtherScan
      </Button>

      <Flex flexDir="column" gap="0.5rem" mt="2rem">
        <TableContainer maxW="calc(100vw - 200px)">
          <Table>
            <Tbody>
              <Tr>
                <Td fontWeight="semibold" color="gray.600">
                  Name
                </Td>
                <Td userSelect="text">{account.name}</Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" color="gray.600">
                  Address
                </Td>
                <Td
                  whiteSpace="normal"
                  wordBreak="break-all"
                  fontFamily="mono"
                  fontSize="sm"
                  userSelect="text"
                >
                  <Link
                    href={`https://goerli-optimism.etherscan.io/address/${account.address}`}
                    target="_blank"
                  >
                    {account.address}
                  </Link>
                </Td>
              </Tr>
              <Tr>
                <Td fontWeight="semibold" color="gray.600">
                  Public Key
                </Td>
                <Td
                  whiteSpace="normal"
                  wordBreak="break-all"
                  fontFamily="mono"
                  fontSize="sm"
                  userSelect="text"
                >
                  {account.public_key}
                </Td>
              </Tr>
              <Tr>
                <Td
                  wordBreak="break-all"
                  fontWeight="semibold"
                  color="gray.600"
                >
                  Private Key
                </Td>
                <Td
                  wordBreak="break-all"
                  whiteSpace="normal"
                  fontFamily="mono"
                  fontSize="sm"
                  userSelect="text"
                >
                  {account.private_key}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <Flex mt="2rem" w="full">
          <Tag p="1em" colorScheme="gray" w="full">
            <BsExclamationCircle
              style={{ marginRight: '0.7em' }}
              color="var(--chakra-colors-gray-500)"
              fontSize="1.3em"
            />
            All your files information is stored on your account file. Export
            your account often to avoid loss.
          </Tag>
        </Flex>
      </Flex>
    </Flex>
  );
}
