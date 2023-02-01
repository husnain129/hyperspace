/* eslint-disable no-nested-ternary */
/* eslint-disable react/require-default-props */
/* eslint-disable react/no-children-prop */
import {
  CircularProgress,
  CircularProgressLabel,
  Flex,
  Heading,
  HStack,
  IconButton,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useClipboard,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FileStatus, IFile } from 'main/IFile';
import prettyBytes from 'pretty-bytes';
import { useState } from 'react';
import {
  BsFileEarmarkFill,
  BsFileEarmarkLock2Fill,
  BsStopFill,
} from 'react-icons/bs';
import { HiDownload } from 'react-icons/hi';
import { MdLink, MdLinkOff } from 'react-icons/md';
import useAccount from 'renderer/hooks/useAccount';
import useFiles from 'renderer/hooks/useFiles';
import FileDetailsDrawer from './FileDetailsDrawer';

const FileTableData = ({
  file,
  onDownloadClick,
  downloading,
  onDelete,
  onAbortDownload,
  onSelect,
}: {
  file: IFile;
  onDownloadClick: () => void;
  downloading?: { progress: number };
  onDelete: () => void;
  onAbortDownload: () => void;
  onSelect: () => void;
}) => {
  const { onCopy, value, setValue, hasCopied } = useClipboard(
    `${file.downloadURL}?as=${file.name}`
  );

  const { name } = file;
  const size = prettyBytes(file.fileSize);
  const uploadedAt = format(new Date(file.timerStart * 1000), 'MMM dd, yyyy');
  const lastVerifiedAt = uploadedAt;

  return (
    <Tr>
      <Td>
        <HStack onClick={onSelect} cursor="pointer">
          {file.isEncrypted ? (
            <BsFileEarmarkLock2Fill
              size="1.2em"
              color="#616161"
              style={{ flexShrink: 0 }}
            />
          ) : (
            <BsFileEarmarkFill
              size="1.2em"
              color="#616161"
              style={{ flexShrink: 0 }}
            />
          )}

          <Text
            _hover={{ textDecoration: 'underline' }}
            fontSize=".85em"
            fontWeight="semibold"
            color="#616161"
            maxW="30ch"
            whiteSpace="normal"
            wordBreak="break-word"
          >
            {name}
          </Text>
        </HStack>
      </Td>
      <Td>
        <Text fontSize=".85em" color="#949494" fontWeight="500">
          {size}
        </Text>
      </Td>
      <Td>
        <Text fontSize=".85em" color="#949494" fontWeight="500">
          {uploadedAt}
        </Text>
      </Td>
      <Td>
        <Text fontSize=".85em" color="#949494" fontWeight="500">
          {lastVerifiedAt}
        </Text>
      </Td>
      <Td>
        <HStack>
          {!downloading ? (
            <IconButton
              aria-label="download"
              colorScheme="gray"
              borderRadius="full"
              border="1px solid"
              size="sm"
              borderColor="gray.300"
              variant="ghost"
              children={<HiDownload color="var(--chakra-colors-gray-700)" />}
              onClick={onDownloadClick}
            />
          ) : (
            <CircularProgress
              capIsRound
              isIndeterminate={downloading.progress === 0}
              thickness="6px"
              value={downloading.progress}
              color="primary.400"
              size="32px"
              pos="relative"
              cursor="pointer"
              onClick={() => onAbortDownload()}
              sx={{
                '&:hover .stop': {
                  display: 'block !important',
                },

                '&:hover .label': {
                  display: 'none !important',
                },
              }}
            >
              <CircularProgressLabel className="label">
                {downloading.progress}%
              </CircularProgressLabel>
              <BsStopFill
                color="var(--chakra-colors-primary-500)"
                className="stop"
                style={{
                  display: 'none',

                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  fontSize: '0.4em',
                }}
              />
            </CircularProgress>
          )}
          {!file.isEncrypted ? (
            <Tooltip
              isOpen={hasCopied}
              hasArrow
              placement="top"
              label="Link Copied!"
              // bg="gray.300"
              // color="black"
            >
              <IconButton
                aria-label="copy link"
                colorScheme="gray"
                borderRadius="full"
                border="1px solid"
                size="sm"
                borderColor="gray.300"
                variant="ghost"
                children={
                  <MdLink size="1.2em" color="var(--chakra-colors-gray-700)" />
                }
                onClick={() => onCopy()}
              />
            </Tooltip>
          ) : (
            <IconButton
              aria-label="link disabled"
              colorScheme="gray"
              borderRadius="full"
              border="1px solid"
              size="sm"
              borderColor="gray.300"
              variant="ghost"
              children={
                <MdLinkOff size="1.2em" color="var(--chakra-colors-gray-700)" />
              }
              isDisabled
            />
          )}

          {/* <IconButton
            onClick={onDelete}
            aria-label="delete"
            colorScheme="gray"
            borderRadius="full"
            border="1px solid"
            size="sm"
            borderColor="gray.300"
            variant="ghost"
            isDisabled={!!downloading}
            children={<BiTrash />}
          /> */}
        </HStack>
      </Td>
    </Tr>
  );
};

const FileContainer = () => {
  const files = useFiles();
  const { account } = useAccount();
  const [selectedFile, setSelectedFile] = useState(-1);
  const handleDownload = (fileKey: string) => {
    files.downloadFile(fileKey, account.private_key).catch((er) => {
      console.warn(er);
    });
  };
  const handleAbortDownload = (fileKey: string) => {
    files.abortDownload(fileKey);
  };
  const handleDelete = (fileKey: string) => {
    files.downloadFile(fileKey, account.private_key).catch((er) => {
      console.warn(er);
    });
  };

  return (
    <Flex
      w="full"
      // bg="blue"
      h="full"
      p="2em"
      alignItems="flex-start"
      flexDir="column"
    >
      <Heading size="md" color="gray.700" mb="2rem">
        Dashboard
      </Heading>
      <TableContainer
        w="full"
        maxWidth="calc(100vw - 300px )"
        mx="auto"
        alignSelf="center"
        // maxH="70vh"
        pr="1em"
        overflowY="auto"
      >
        <Table variant="simple">
          <Thead w="full">
            <Tr>
              <Th textTransform="none" color="gray.500">
                Name
              </Th>
              <Th textTransform="none" color="gray.500">
                File Size
              </Th>
              <Th textTransform="none" color="gray.500">
                Upload On
              </Th>
              <Th textTransform="none" color="gray.500">
                Last Verified
              </Th>
              <Th textTransform="none" color="gray.500">
                Actions
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {files.isLoading ? (
              <Spinner />
            ) : files.files.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <Text
                    textAlign="center"
                    fontWeight="500"
                    fontSize="sm"
                    color="gray.400"
                  >
                    Your files will appear here.
                  </Text>
                </Td>
              </Tr>
            ) : (
              files.files
                .sort((x, y) => y.timerStart - x.timerStart)
                .map((f, i) => (
                  <FileTableData
                    onSelect={() =>
                      setSelectedFile(
                        files.files.findIndex((ff) => ff.fileKey === f.fileKey)
                      )
                    }
                    onDelete={() => handleDelete(f.fileKey)}
                    file={f}
                    key={f.fileKey}
                    onAbortDownload={() => {
                      handleAbortDownload(f.fileKey);
                    }}
                    onDownloadClick={() => handleDownload(f.fileKey)}
                    downloading={
                      f.status === FileStatus.DOWNLOADING
                        ? {
                            progress: f.progress,
                          }
                        : undefined
                    }
                  />
                ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      {selectedFile >= 0 && (
        <FileDetailsDrawer
          file={files.files[selectedFile]}
          onClose={() => setSelectedFile(-1)}
        />
      )}
    </Flex>
  );
};

export default FileContainer;
