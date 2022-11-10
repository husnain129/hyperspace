/* eslint-disable promise/catch-or-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */

import {
  Button,
  Divider,
  Flex,
  HStack,
  Link,
  Select,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import {
  BsFileEarmark,
  BsFileEarmarkBinaryFill,
  BsFileEarmarkFill,
  BsFillFileEarmarkZipFill,
} from 'react-icons/bs';
import prettyBytes from 'pretty-bytes';
import { useCallback, useEffect, useState } from 'react';
import BladeSpinner from '../blade-spinner/BladeSpinner';
import { MTD } from '../nodes/nodes';
import { IoReloadCircle, IoReloadOutline, IoWarning } from 'react-icons/io5';

const UploadFile = (props: { name: string; ext: string; size: number }) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<
    Array<{
      statsLoading: boolean;
      onlineStatus: boolean;
      address: string;
      host: string;
      tlsCert: string;
      owner: string;
      freeStorage: number;
      latency: number;
    }>
  >([]);

  const fetchNodes = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const r = window.electron.ipcRenderer.invoke('get-nodes');
      // eslint-disable-next-line promise/always-return, promise/catch-or-return
      r.then((s) => {
        console.log('Nodes:', s);
        setList(
          (s as typeof list).map((n) => ({
            ...n,
            freeStorage: 0,
            statsLoading: true,
            onlineStatus: false,
          }))
        );
        setTimeout(() => {
          const nodeR = window.electron.ipcRenderer.invoke(
            'get-node-info',
            'localhost:8000'
          );
          nodeR
            .then((res) => {
              setList((_list) =>
                _list.map((_l, i) =>
                  i > 0
                    ? { ..._l, statsLoading: false }
                    : {
                        ..._l,
                        freeStorage: res.freeStorage,
                        latency: res.latency,
                        onlineStatus: true,
                        statsLoading: false,
                      }
                )
              );
            })
            .catch((er) => {
              setList((_list) =>
                _list.map((_l, i) =>
                  i > 0
                    ? { ..._l, statsLoading: false }
                    : {
                        ..._l,
                        onlineStatus: false,
                        freeStorage: 0,
                        statsLoading: false,
                      }
                )
              );
            })
            .finally(() => {
              setLoading(false);
            });
        }, 2000);
      })
        .catch((er) => console.log(er))
        .finally(() => {});
    }, 2000);
  }, []);
  useEffect(() => {
    fetchNodes();
    return () => {
      setList([]);
    };
  }, [fetchNodes]);

  return (
    <VStack w="35em" gap="1em">
      <HStack w="full" alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" justifyContent="space-between" spacing={4}>
          <BsFileEarmarkFill
            size="1.8em"
            color="var(--chakra-colors-gray-800)"
          />
          <VStack align="flex-start" spacing={0}>
            <Flex
              justifyContent="flex-start"
              flexDir="column"
              alignItems="center"
            >
              <Text fontSize=".9em" fontWeight="semibold">
                {props.name}
                {props.ext}
              </Text>
            </Flex>

            <Text m={0} fontSize=".8em" color="#7A7A7A" fontWeight="semibold">
              {prettyBytes(props.size || 0)}
            </Text>
          </VStack>
        </HStack>
      </HStack>
      <Divider />
      <Flex justify="space-between" align="center" w="full">
        <Text fontSize="1em" w="full" textAlign="start" fontWeight="bold">
          Select Storage Node
        </Text>
        <Select placeholder="Sort" maxW="17ch" size="sm">
          <option value="ask">Ask</option>
          <option value="latency">Latency</option>
          <option value="recommendation">Recommendation</option>
        </Select>
      </Flex>
      <TableContainer w="full" overflowY="auto" maxH="30vh">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th textTransform="none" color="gray.500">
                Node
              </Th>
              <Th textTransform="none" color="gray.500">
                Ask
              </Th>
              <Th textTransform="none" color="gray.500">
                Latency
              </Th>
              <Th textTransform="none" color="gray.500">
                Recommendation
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading && (
              <Tr>
                <Td colSpan={4} textAlign="center">
                  <BladeSpinner />
                </Td>
              </Tr>
            )}
            {!loading && list.filter((s) => s.onlineStatus).length === 0 && (
              <Tr>
                <Td colSpan={4}>
                  <Flex
                    flexDir="column"
                    w="full"
                    justify="center"
                    align="center"
                    gap="0.8rem"
                  >
                    <Flex
                      gap="0.5em"
                      fontWeight="450"
                      align="center"
                      w="full"
                      justify="center"
                    >
                      <IoWarning />

                      <Text fontSize="sm" textAlign="center">
                        {`No nodes seems to be reachable. Make sure you're online.`}
                      </Text>
                    </Flex>
                    <Button
                      size="sm"
                      maxW="max-content"
                      variant="link"
                      onClick={() => fetchNodes()}
                      leftIcon={<IoReloadOutline />}
                    >
                      Relaod
                    </Button>
                  </Flex>
                </Td>
              </Tr>
            )}
            {!loading &&
              list
                .filter((s) => s.onlineStatus)
                .map((l, i) => (
                  <Tr key={i}>
                    <MTD>
                      <Link
                        fontFamily="mono"
                        color="blue.600"
                        href={`https://etherscan.io/address/${l.address}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {l.address}
                      </Link>
                    </MTD>
                    <Td>
                      <Text fontSize=".9em" color="#7D7D7D">
                        Ξ 0.34
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize=".9em" color="#7D7D7D">
                        {l.latency} ms
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize=".9em" color="#7D7D7D">
                        Good
                      </Text>
                    </Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default UploadFile;
