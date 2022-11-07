import {
  Flex,
  HStack,
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
import { BsFillFileEarmarkZipFill } from 'react-icons/bs';

const UploadFile = () => {
  return (
    <VStack w="35em" h="15em" gap="1em">
      <HStack w="full" alignItems="center" justifyContent="space-between">
        <HStack alignItems="center" justifyContent="space-between">
          <BsFillFileEarmarkZipFill size="1.5em" />
          <Flex
            justifyContent="flex-start"
            flexDir="column"
            alignItems="center"
          >
            <Text fontSize=".9em"> FYP.zip</Text>
            <Text fontSize=".8em" color="#7A7A7A">
              128 MB
            </Text>
          </Flex>
        </HStack>
        <Select placeholder="Sort" w="max-content">
          <option value="ask">Ask</option>
          <option value="latecy">Latecy</option>
          <option value="recommendation">Recommendation</option>
        </Select>
      </HStack>
      <Text fontSize="1.1em" w="full" textAlign="start" fontWeight="semibold">
        Select Storage Node
      </Text>
      <TableContainer w="full">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Node</Th>
              <Th>Ask</Th>
              <Th>Latecy</Th>
              <Th>Recommendation</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <Text fontSize=".9em" color="#7D7D7D">
                  Big3
                </Text>
              </Td>
              <Td>
                <Text fontSize=".9em" color="#7D7D7D">
                  Ξ 0.34
                </Text>
              </Td>
              <Td>
                <Text fontSize=".9em" color="#7D7D7D">
                  94ms
                </Text>
              </Td>
              <Td>
                <Text fontSize=".9em" color="#7D7D7D">
                  Good
                </Text>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default UploadFile;
