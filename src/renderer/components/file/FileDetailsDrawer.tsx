/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-children-prop */
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { formatEther, hexlify } from 'ethers/lib/utils';
import { IFile } from 'main/IFile';
import { IGetMerkleProofResponse } from 'node-api/node-api';
import prettyBytes from 'pretty-bytes';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BiCheck, BiError, BiRadar } from 'react-icons/bi';
import {
  BsFileEarmarkFill,
  BsFileEarmarkLock2Fill,
  BsQuestionCircle,
} from 'react-icons/bs';
import { IoReload } from 'react-icons/io5';
import { MdOutlineAccountTree } from 'react-icons/md';
import BladeSpinner from '../blade-spinner/BladeSpinner';

export default function FileDetailsDrawer({
  file,
  onClose,
}: {
  file: IFile;
  onClose: () => void;
}) {
  const [integrityStatus, setIntegrityStatus] = useState<
    'IDLE' | 'LOADING' | 'RESULT'
  >('IDLE');
  const [integrityResult, setIntegrityResult] = useState({
    status: false,
    selectedSegment: -1,
    error: '',
  });

  const verifyIntegrity = useCallback(
    async (
      fileKey: string,
      segmentIndex: number
    ): Promise<{ result: IGetMerkleProofResponse | null; error: any }> => {
      console.log('Sel seg ind', segmentIndex);
      const { host } = await window.electron.ipcRenderer.invoke(
        'node-contract-info',
        file.storageContractAddress
      );
      return window.electron.ipcRenderer.invoke('node-get-proof', {
        host,
        fileKey,
        segmentIndex,
      });
    },
    [file.storageContractAddress]
  );

  const handleVerifyFile = useCallback(async () => {
    setIntegrityStatus('LOADING');
    const segmentIndex = Math.floor(Math.random() * file.segmentsCount) - 1;
    setIntegrityResult({
      selectedSegment: segmentIndex,
      error: '',
      status: false,
    });
    try {
      const res = await verifyIntegrity(file.fileKey, segmentIndex);
      if (res.error) {
        console.log(res.error);
        setIntegrityResult({
          error: 'Something went wrong',
          status: false,
          selectedSegment: segmentIndex,
        });
        toast.error(res.error.details || 'Something went wrong.');

        return;
      }
      const k = hexlify(res.result?.root as any).slice(2);
      console.log(k);
      if (k !== file.fileMerkleRootHash) {
        toast.error('Integerity Failed');
        return;
      }
      setIntegrityResult({
        error: '',
        selectedSegment: segmentIndex,
        status: true,
      });
      // toast.success('Got Proof');
      console.log(res.result);
    } catch (er: any) {
      console.log(er);
      setIntegrityResult({
        error: 'Something went wrong',
        status: false,
        selectedSegment: segmentIndex,
      });

      toast.error('Something went wrong');
    } finally {
      setIntegrityStatus('RESULT');
    }
  }, [verifyIntegrity, file]);
  return (
    <Drawer
      isOpen
      placement="right"
      onClose={onClose}

      // finalFocusRef={btnRef}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader />

        <DrawerBody>
          <VStack align="flex-start" gap="1em">
            <HStack align="flex-start">
              {file.isEncrypted ? (
                <BsFileEarmarkLock2Fill
                  size="1.6em"
                  color="#616161"
                  style={{ flexShrink: 0, marginTop: '0.2em' }}
                />
              ) : (
                <BsFileEarmarkFill
                  size="1.6em"
                  color="#616161"
                  style={{ flexShrink: 0, marginTop: '0.2em' }}
                />
              )}
              <VStack alignItems="flex-start" spacing="0">
                <Heading color="gray.700" size="sm" fontWeight="600">
                  {file.name}
                </Heading>
                <Text fontSize="sm">
                  Uploaded on{' '}
                  {file.timeCreated &&
                    format(new Date(file.timeCreated * 1000), 'MMM dd, yyyy')}
                </Text>
              </VStack>
            </HStack>
            <Flex flexDir="column" gap="0.5em" align="flex-start">
              <Heading color="gray.700" size="sm" fontWeight="600">
                Contract Address
              </Heading>
              <Text
                userSelect="text"
                fontFamily="mono"
                background="#f0f0f0"
                borderRadius="4px"
                p="6px"
                fontSize="sm"
                // whiteSpace="pre-wrap"
                wordBreak="break-all"
              >
                {file.storageContractAddress}
              </Text>
              <Button
                mt="0.2em"
                variant="link"
                leftIcon={<BiRadar fontSize="1.2em" />}
                size="sm"
                href={`https://goerli-optimism.etherscan.io/address/${file.storageContractAddress}`}
                as="a"
                target="_blank"
              >
                View on EtherScan
              </Button>
            </Flex>
            <Flex flexDir="column" gap="0.5em" align="flex-start">
              <Heading color="gray.700" size="sm" fontWeight="600">
                File Size
              </Heading>
              <Text
                userSelect="text"
                // fontFamily={'mono'}
                fontSize="sm"
                fontWeight="500"
                // whiteSpace="pre-wrap"
                wordBreak="break-all"
              >
                {prettyBytes(file.fileSize || 0)} ({` `}
                {file.fileSize} bytes )
              </Text>
            </Flex>
            <Flex flexDir="column" gap="0.5em" align="flex-start">
              <Heading color="gray.700" size="sm" fontWeight="600">
                Fee
              </Heading>
              <Text
                userSelect="text"
                // fontFamily={'mono'}
                fontSize="sm"
                fontWeight="500"
                // whiteSpace="pre-wrap"
                wordBreak="break-all"
              >
                {formatEther(file.bid || 0)} ether
              </Text>
            </Flex>
            <Flex flexDir="column" gap="0.5em" align="flex-start">
              <HStack>
                <Heading color="gray.700" size="sm" fontWeight="600">
                  Merkle Root Hash
                </Heading>

                <Link
                  href="https://en.wikipedia.org/wiki/Merkle_tree"
                  target="_blank"
                >
                  <BsQuestionCircle />
                </Link>
              </HStack>

              <Text
                userSelect="text"
                fontFamily="mono"
                fontSize="sm"
                fontWeight="500"
                // whiteSpace="pre-wrap"
                wordBreak="break-all"
              >
                {file.fileMerkleRootHash}
              </Text>

              {integrityStatus === 'LOADING' ? (
                <HStack align={'center'} mt="0.5em">
                  <BladeSpinner size="sm" />
                  <Text fontSize="sm" fontWeight={'600'} color="gray.600">
                    Verifying Integrity
                  </Text>
                </HStack>
              ) : integrityStatus === 'RESULT' ? (
                integrityResult.status ? (
                  <HStack mt="0.5em">
                    <BiCheck fontSize={'1.2em'} />
                    <Text fontSize={'sm'}>Integrity Verified</Text>
                    <Box h="1em" w="1px" bg="#ddd" />
                    <Button
                      as="a"
                      target={'_blank'}
                      href={`${file.downloadURL.replace(
                        'get',
                        'proof'
                      )}?index=${integrityResult.selectedSegment}`}
                      variant={'link'}
                      color="#333"
                      leftIcon={<MdOutlineAccountTree size="1em" />}
                      size="sm"
                    >
                      View Proof
                    </Button>
                  </HStack>
                ) : (
                  <VStack align={'flex-start'} mt="0.5em">
                    <HStack>
                      <BiError color="var(--chakra-colors-red-600)" />
                      <Text fontSize={'sm'}>Verification Failed</Text>
                      <Box h="1em" w="1px" bg="#ddd" />
                      <Button
                        variant={'link'}
                        leftIcon={<IoReload />}
                        size="sm"
                        onClick={handleVerifyFile}
                      >
                        Retry
                      </Button>
                    </HStack>
                  </VStack>
                )
              ) : (
                <Button
                  variant={'outline'}
                  mt="0.5em"
                  size="sm"
                  onClick={handleVerifyFile}
                  leftIcon={<MdOutlineAccountTree size="1.2em" />}
                >
                  Verify Integrity
                </Button>
              )}

              {/* <Link
                textDecor={'underline'}
                mt="0.5em"
                fontSize={'sm'}
                fontWeight={'500'}
                display={'flex'}
                alignItems="center"
                gap="8px"
                href={`${file.downloadURL.replace('get', 'proof')}?index=1`}
                target="_blank"
              >
                <MdOutlineAccountTree size="1.2em" />
                Verify Integrity
              </Link> */}
            </Flex>
            <Flex flexDir="column" gap="0.5em" align="flex-start">
              <HStack>
                <Heading color="gray.700" size="sm" fontWeight="600">
                  Encryption
                </Heading>
              </HStack>
              {file.isEncrypted ? (
                <Text
                  userSelect="text"
                  fontFamily="mono"
                  fontSize="sm"
                  fontWeight="500"
                  // whiteSpace="pre-wrap"
                  wordBreak="break-all"
                  display="flex"
                  alignItems="center"
                  gap="0.5em"
                >
                  AES-256-CBC{' '}
                  <Link
                    marginTop="-2px"
                    href="https://en.wikipedia.org/wiki/Advanced_Encryption_Standard"
                    target="_blank"
                  >
                    <BsQuestionCircle />
                  </Link>
                </Text>
              ) : (
                <Text
                  userSelect="text"
                  fontFamily="mono"
                  fontSize="sm"
                  fontWeight="500"
                  // whiteSpace="pre-wrap"
                  wordBreak="break-all"
                >
                  Not Encrypted
                </Text>
              )}
            </Flex>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
