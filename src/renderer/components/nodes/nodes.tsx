/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */
import {
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

export default function Nodes() {
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState<
    Array<{
      onlineStatus: boolean;
      address: string;
      host: string;
      tlsCert: string;
      owner: string;
      freeStorage: number;
      latency: number;
    }>
  >([]);

  useEffect(() => {
    console.log('Trig get-nodes');
    setLoading(true);
    const r = window.electron.ipcRenderer.invoke('get-nodes');
    // eslint-disable-next-line promise/always-return, promise/catch-or-return
    r.then((s) => {
      console.log('Nodes:', s);
      setList(s);
      const nodeR = window.electron.ipcRenderer.invoke(
        'get-node-info',
        'localhost:8000'
      );
      nodeR
        .then((res) => {
          setList((_list) =>
            _list.map((_l, i) =>
              i > 0
                ? _l
                : {
                    ..._l,
                    freeStorage: res.freeStorage,
                    latency: res.latency,
                    onlineStatus: true,
                  }
            )
          );
        })
        .catch((er) => {
          setList((_list) =>
            _list.map((_l, i) => (i > 0 ? _l : { ..._l, onlineStatus: false }))
          );
        });
    })
      .catch((er) => console.log(er))
      .finally(() => {
        setLoading(false);
      });

    return () => {
      setList([]);
    };
  }, []);

  const MTD = (props: React.ComponentProps<typeof Td>) => (
    <Td
      // eslint-disable-next-line react/jsx-props-no-spreading
      p={0}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      <Flex
        flex={1}
        w="full"
        fontSize="sm"
        maxW="15ch"
        overflowX="auto"
        whiteSpace="nowrap"
        px="1em"
        // bg="green"
        py="0.8em"
        mb="0.1em"
      >
        {/* eslint-disable-next-line react/destructuring-assignment */}
        {props.children}
      </Flex>
    </Td>
  );
  return (
    <Flex w="full" flexDir="column" p="2em">
      <Heading size="md" mb="1.5rem">
        Nodes
      </Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th textTransform="none" color="gray.500" px="1em">
              Address
            </Th>
            <Th textTransform="none" color="gray.500" px="1em">
              Host
            </Th>
            <Th textTransform="none" color="gray.500" px="1em">
              Owner
            </Th>
            <Th textTransform="none" color="gray.500" px="1em">
              Status
            </Th>
            <Th textTransform="none" color="gray.500" px="1em">
              Available Storage
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {loading &&
            [...Array(5)].map((_, r) => (
              <Tr key={r}>
                {[...Array(5)].map((__, i) => (
                  <MTD key={i}>
                    <Skeleton w="10ch" h="1em" />
                  </MTD>
                ))}
              </Tr>
            ))}
          {list.map((l, i) => (
            // eslint-disable-next-line react/no-array-index-key
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

              <MTD>{l.host}</MTD>

              <MTD>
                <Link
                  fontFamily="mono"
                  color="blue.600"
                  href={`https://etherscan.io/address/${l.owner}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.owner}
                </Link>
              </MTD>
              <MTD>{l.onlineStatus ? 'Online' : 'Offline'}</MTD>
              <MTD fontFamily="mono">{l.freeStorage} B</MTD>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
}
