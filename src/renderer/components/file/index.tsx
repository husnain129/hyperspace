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
import { BiDownload, BiTrash, BiTrashAlt } from 'react-icons/bi';
import { BsFillFileEarmarkZipFill } from 'react-icons/bs';

const FileTableData = () => {
  return (
    <Tr>
      <Td>
        <HStack>
          <BsFillFileEarmarkZipFill size="1.2em" color="#616161" />
          <Text fontSize=".85em" fontWeight="semibold" color="#616161">
            Fyp Docs.zip
          </Text>
        </HStack>
      </Td>
      <Td>
        <Text fontSize=".85em" color="#949494" fontWeight="500">
          14 KB
        </Text>
      </Td>
      <Td>
        <Text fontSize=".85em" color="#949494" fontWeight="500">
          Aug 25, 2022
        </Text>
      </Td>
      <Td>
        <Text fontSize=".85em" color="#949494" fontWeight="500">
          Aug 27, 2022
        </Text>
      </Td>
      <Td>
        <HStack>
          <IconButton
            aria-label="download"
            colorScheme="gray"
            borderRadius="full"
            border="1px solid"
            size="sm"
            borderColor="gray.300"
            variant="ghost"
            children={<BiDownload />}
          />
          <IconButton
            aria-label="delete"
            colorScheme="gray"
            borderRadius="full"
            border="1px solid"
            size="sm"
            borderColor="gray.300"
            variant="ghost"
            children={<BiTrash />}
          />
        </HStack>
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
