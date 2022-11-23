/* eslint-disable consistent-return */
/* eslint-disable promise/catch-or-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-nested-ternary */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-restricted-syntax */

import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Link,
  Select,
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
import { intervalToDuration } from 'date-fns';
import { ethers } from 'ethers';
import prettyBytes from 'pretty-bytes';
import { useCallback, useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import toast from 'react-hot-toast';
import { BiCheck } from 'react-icons/bi';
import { BsFileEarmarkFill } from 'react-icons/bs';
import { IoReloadOutline, IoWarning } from 'react-icons/io5';
import useFiles from 'renderer/hooks/useFiles';
import BladeSpinner from '../blade-spinner/BladeSpinner';
import { MTD } from '../nodes/nodes';

const toUnix = (d: Date) => Math.floor(d.getTime() / 1000);

export const durationToSeconds = (d: Duration) =>
  (d.years || 0) * 360 * 24 * 60 * 60 +
  (d.months || 0) * 30 * 24 * 60 * 60 +
  (d.days || 0) * 24 * 60 * 60 +
  (d.hours || 0) * 60 * 60 +
  (d.minutes || 0) * 60 +
  (d.seconds || 0);

interface IList {
  address: string;
  host: string;
  tlsCert: string;
  owner: string;
  loading: boolean;
  online: boolean;
  bid: bigint;
  latency: number;
  canStore: boolean;
}

const UploadFile = (props: {
  name: string;
  ext: string;
  size: number;
  path: string;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const [list, setList] = useState<Array<IList>>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [stage, setStage] = useState<
    'DURATION' | 'NODE_SELECTION' | 'HASHING' | 'UPLOADING' | 'COMPLETE'
  >('DURATION');

  const fetchNodesData = useCallback(
    (timePeriod: number, nodesList: Array<IList>) => {
      nodesList.map((n, i) => {
        window.electron.ipcRenderer
          .invoke('node-ping', {
            host: n.host,
            fileSize: props.size,
            timePeriod,
            segmentsCount: 1000,
          })
          .then((data) => {
            console.log('Got node info:', data);
            setList((_list) =>
              _list.map((_l, _i) =>
                _i !== i
                  ? _l
                  : {
                      ..._l,
                      loading: false,
                      online: true,
                      bid: data.bidPrice || BigInt(0),
                      canStore: data.canStore,
                      latency: data.latency,
                    }
              )
            );
          })
          .catch((er) => {
            setList((_list) =>
              _list.map((_l, _i) =>
                _i !== i ? _l : { ..._l, loading: false, online: false }
              )
            );
          });

        return { ...n, loading: true };
      });
    },
    []
  );

  const fetchNodes = useCallback(
    (endDateTime: Date) => {
      setLoading(true);
      setTimeout(() => {
        const r = window.electron.ipcRenderer.invoke('get-nodes');
        console.log('Got nodes:', r);

        // eslint-disable-next-line promise/always-return, promise/catch-or-return
        r.then((s) => {
          console.log('Nodes:', s);
          const l = (s as typeof list).map((n) => ({
            address: n.address,
            bid: BigInt(0),
            canStore: false,
            host: n.host,
            latency: 0,
            loading: false,
            online: true,
            owner: n.owner,
            tlsCert: n.tlsCert,
          }));
          setList(l);
          console.log('fetchNodesData');

          setStartDate(new Date());
          fetchNodesData(toUnix(endDateTime) - toUnix(new Date()), l);
        })
          .catch((er) => console.log(er))
          .finally(() => {
            setLoading(false);
          });
      }, 2000);
    },
    [fetchNodesData]
  );

  useEffect(() => {
    if (!endDate) return;
    // const d = intervalToDuration({ start: new Date(date), end: new Date() });

    fetchNodes(endDate);
    return () => {
      setList([]);
    };
  }, [fetchNodes, endDate]);

  const [selectedNode, setSelectedNode] = useState(-1);
  const [computedHash, setComputedHash] = useState('');
  const [fileKey, setFileKey] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const [hashProgress, setHashProgress] = useState(0);

  useEffect(() => {
    const unsubHash = window.electron.ipcRenderer.on(
      'node-hash-progress',
      ({ filePath, progress }: any) => {
        if (filePath === props.path) {
          setHashProgress(Math.round((progress as number) * 100));
        }
      }
    );
    const unsubUploadComplete = window.electron.ipcRenderer.on(
      'file-complete',
      ({ fileKey: fk }: any) => {
        if (fileKey && fk === fileKey) {
          setStage('COMPLETE');
        }
      }
    );
    const unsubUploadError = window.electron.ipcRenderer.on(
      'file-error',
      ({ fileKey: fk, name, message }: any) => {
        if (fileKey && fk === fileKey) {
          setStage('DURATION');
          toast.error('Something went wrong while uploading');
        }
      }
    );
    const unsubUpload = window.electron.ipcRenderer.on(
      'file-progress',
      ({ fileKey: fk, progress }: any) => {
        console.log('P:', fk, progress);
        if (fileKey && fk === fileKey) {
          setUploadProgress(Math.round(progress as number));
        }
      }
    );
    return () => {
      if (unsubHash) unsubHash();
      if (unsubUpload) unsubUpload();
      if (unsubUploadComplete) unsubUploadComplete();
      if (unsubUploadError) unsubUploadError();
    };
  }, [fileKey, props.path]);

  const { uploadFile, computeMerkleRootHash } = useFiles();

  const onNodeSelect = async (listIndex: number) => {
    // console.log(node.host);
    setStage('HASHING');
    if (!startDate || !endDate) return;

    computeMerkleRootHash(props.path)
      .then((hash) => {
        setStage('UPLOADING');
        setComputedHash(hash);

        const node = list[listIndex];
        setSelectedNode(listIndex);
        uploadFile({
          bid: node.bid.toString(),
          filePath: props.path,
          fileSize: props.size,
          host: node.host,

          segmentsCount: 1000,
          timeStart: toUnix(startDate),
          timeEnd: toUnix(endDate),
          merkleRootHash: hash,
          storageNodeAddress: node.address,
        })
          .then((fk) => {
            console.log('Got FileKey', fk);
            setFileKey(fk);
          })
          .catch((er) => toast.error(er?.toString()));
      })
      .catch((er) => {
        setStage('NODE_SELECTION');
        toast.error('Something went wrong!');
      });
    // toast.success(token);
  };
  return (
    <VStack w="35em" gap="1em">
      <HStack w="full" alignItems="center" justifyContent="space-between">
        <HStack
          flex={1}
          alignItems="center"
          // justifyContent="space-between"
          spacing={4}
        >
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
                {props.name.slice(0, 20) +
                  (props.name.length > 20 ? '...' : '')}
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
      {stage === 'DURATION' && (
        <Flex
          alignSelf="flex-start"
          align="flex-start"
          justify="flex-start"
          flexDir="column"
          gap="1em"
          // x="1em"
          // flex={1}
        >
          <FormControl>
            <FormLabel>Select Duration</FormLabel>
            <Input
              onChange={(e) => {
                const eDate = new Date(e.target.valueAsDate!);
                eDate.setHours(23);
                eDate.setMinutes(59);
                eDate.setSeconds(59);
                console.log('>', eDate);
                setEndDate(eDate);
              }}
              value={(() => {
                if (!endDate) return '';
                const now = endDate;

                const day = `0${now.getDate()}`.slice(-2);
                const month = `0${now.getMonth() + 1}`.slice(-2);

                return `${now.getFullYear()}-${month}-${day}`;
              })()}
              type="date"
              placeholder="Duration"
              size="sm"
              w="19.5ch"
              // w="100%"
            />
          </FormControl>
          <Button
            isDisabled={!endDate}
            colorScheme="primary"
            onClick={() => {
              if (endDate) setStage('NODE_SELECTION');
            }}
          >
            Next
          </Button>
        </Flex>
      )}
      {stage === 'COMPLETE' && (
        <Flex flexDir="column" w="full" gap="2em">
          {/* <Text
            fontSize="1em"
            w="full"
            textAlign="start"
            fontWeight="bold"
            color="gray.700"
          >
            Processing File
          </Text> */}

          <Flex flexDir="column" align="center" gap=".5em">
            <BiCheck fontSize="5em" />
            <Text fontWeight="black" fontSize="md" color="gray.700">
              Upload Complete
            </Text>
          </Flex>
          <Button
            maxW="max-content"
            mx="auto"
            colorScheme="gray"
            variant="outline"
            onClick={() => props.onClose()}
          >
            Close
          </Button>
        </Flex>
      )}
      {stage === 'HASHING' && (
        <Flex flexDir="column" w="full" gap="2em">
          <Text
            fontSize="1em"
            w="full"
            textAlign="start"
            fontWeight="bold"
            color="gray.700"
          >
            Processing File
          </Text>

          <Flex flexDir="column" align="center" gap=".5em">
            <Box w="32px" h="32px">
              <CircularProgressbar
                value={hashProgress}
                // text={hashProgress.toString()}
              />
            </Box>
            <Text fontWeight="600" fontSize="sm" color="gray.600">
              Computing Merkle Root
            </Text>
          </Flex>
        </Flex>
      )}
      {stage === 'UPLOADING' && (
        <Flex flexDir="column" w="full" gap="2em">
          <Text
            fontSize="1em"
            w="full"
            textAlign="start"
            fontWeight="bold"
            color="gray.700"
          >
            Uploading File
          </Text>

          <Flex flexDir="column" align="center" gap=".5em">
            <BladeSpinner />
            <Text fontWeight="600" fontSize="sm" color="gray.600">
              Uploading to Storage Node ({uploadProgress}%)
            </Text>
          </Flex>
        </Flex>
      )}
      {stage === 'NODE_SELECTION' && (
        <>
          <Flex justify="space-between" align="center" w="full">
            <Text
              fontSize="1em"
              w="full"
              textAlign="start"
              fontWeight="bold"
              color="gray.700"
            >
              Select Storage Node
            </Text>
            <Select placeholder="Sort" maxW="17ch" size="sm">
              <option value="fee">Fee</option>
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
                    Fee
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
                {!loading && list.filter((s) => s.online).length === 0 && (
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
                          onClick={() => fetchNodes(endDate!)}
                          leftIcon={<IoReloadOutline />}
                        >
                          Reload
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                )}
                {!loading &&
                  list
                    .filter((s) => s.online)
                    .map((l, i) => (
                      <Tr
                        key={i}
                        cursor="pointer"
                        _hover={{ bg: '#eee' }}
                        onClick={() => {
                          onNodeSelect(
                            list.findIndex((n) => n.address == l.address)!
                          );
                        }}
                      >
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
                          <Text
                            fontSize=".9em"
                            color="#7D7D7D"
                            fontFamily="mono"
                            fontWeight="500"
                          >
                            Ξ{' '}
                            {Number(ethers.utils.formatEther(l.bid)).toFixed(5)}
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
        </>
      )}
    </VStack>
  );
};

export default UploadFile;
