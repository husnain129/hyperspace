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
  Tr,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { FileStatus, IFile } from 'main/IFile';
import prettyBytes from 'pretty-bytes';
import { BiDownload, BiStop, BiTrash, BiTrashAlt } from 'react-icons/bi';
import {
  BsFile,
  BsFileBinaryFill,
  BsFileEarmark,
  BsFileEarmarkDiffFill,
  BsFileEarmarkFill,
  BsFileFill,
  BsFileWordFill,
  BsFileXFill,
  BsFillFileEarmarkZipFill,
  BsStop,
  BsStopFill,
} from 'react-icons/bs';
import { FiFile } from 'react-icons/fi';
import { HiDownload } from 'react-icons/hi';
import { MdFilePresent, MdOutlineDownload } from 'react-icons/md';
import useAccount from 'renderer/hooks/useAccount';
import useFiles from 'renderer/hooks/useFiles';
import BladeSpinner from '../blade-spinner/BladeSpinner';

const FileTableData = ({
  file,
  onDownloadClick,
  downloading,
  onDelete,
}: {
  file: IFile;
  onDownloadClick: () => void;
  downloading?: { progress: number };
  onDelete: () => void;
}) => {
  const { name } = file;
  const size = prettyBytes(file.fileSize);
  const uploadedAt = format(new Date(file.timerStart * 1000), 'MMM dd, yyyy');
  const lastVerifiedAt = uploadedAt;
  return (
    <Tr>
      <Td>
        <HStack>
          <BsFileEarmarkFill
            size="1.2em"
            color="#616161"
            style={{ flexShrink: 0 }}
          />
          <Text
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
              thickness="6px"
              value={downloading.progress}
              color="primary.400"
              size="32px"
              pos="relative"
              cursor="pointer"
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
  const handleDownload = (fileKey: string) => {
    files.downloadFile(fileKey, account.private_key).catch((er) => {
      console.warn(er);
    });
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
                    onDelete={() => handleDelete(f.fileKey)}
                    file={f}
                    key={f.fileKey}
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
    </Flex>
  );
};

export default FileContainer;
