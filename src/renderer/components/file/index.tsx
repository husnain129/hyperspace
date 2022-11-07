/* eslint-disable react/no-children-prop */
import {
  Flex,
  HStack,
  IconButton,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { BiDownload } from 'react-icons/bi';
import { BsFillFileEarmarkZipFill } from 'react-icons/bs';

const FileTableData = () => {
  return (
    <Tr>
      <Td>
        <HStack>
          <BsFillFileEarmarkZipFill size="1.2em" />
          <Text fontSize=".9em" fontWeight="semibold" color="#616161">
            Fyp Docs.zip
          </Text>
        </HStack>
      </Td>
      <Td>
        <Text fontSize=".9em" color="#949494">
          14 KB
        </Text>
      </Td>
      <Td>
        <Text fontSize=".9em" color="#949494">
          Aug 25, 2025
        </Text>
      </Td>
      <Td>
        <Text fontSize=".9em" color="#949494">
          Aug 27, 2025
        </Text>
      </Td>
      <Td>
        <IconButton
          aria-label="download"
          colorScheme="primary"
          children={<BiDownload />}
        />
      </Td>
    </Tr>
  );
};

const FileContainer = () => {
  return (
    <Flex
      w="full"
      h="full"
      p="2em"
      alignItems="flex-start"
      justifyContent="center"
    >
      <Table>
        <Table variant="simple">
          <Thead w="full">
            <Tr>
              <Th>Name</Th>
              <Th>File Size</Th>
              <Th>Upload On</Th>
              <Th>Last Verfied</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            <FileTableData />
            <FileTableData />
            <FileTableData />
          </Tbody>
        </Table>
      </Table>
    </Flex>
  );
};

export default FileContainer;
