import {
  Button,
  Flex,
  Input,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { IAccount } from 'main/db-api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { BiRadar } from 'react-icons/bi';
import { BsChevronRight } from 'react-icons/bs';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const AlreadyHaveAnAccount = ({
  onAccountLoaded,
}: {
  onAccountLoaded: (account: IAccount) => void;
}) => {
  const navigate = useNavigate();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [accountPath, setAccountPath] = useState('');

  const handleBrowser = async () => {
    try {
      const acc = await window.electron.ipcRenderer.invoke(
        'browse-load-account'
      );

      if (acc && acc.path && acc.account) {
        console.log(acc);
        setAccount(acc.account);
        setAccountPath(acc.path);
      }
    } catch (er) {
      toast.error('Something went wrong.');
    }
  };
  const handleConfirm = async () => {
    try {
      if (!account || !accountPath) throw new Error('expected error');
      await window.electron.ipcRenderer.invoke(
        'load-account-from-file',
        accountPath
      );
      onAccountLoaded(account);
    } catch (er) {
      toast.error('Something went wrong.');
    }
  };
  return (
    <VStack
      w="full"
      alignItems="flex-start"
      h="full"
      justifyContent="space-between"
    >
      {!account ? (
        <VStack
          w="full"
          align="flex-start"
          alignSelf="center"
          justify="center"
          flex={1}
          spacing={1}
          marginTop="0rem"
        >
          <Text fontSize="1.7em" fontWeight="black">
            {`Let's locate your account`}
          </Text>
          <VStack pt="2em" gap="1em" w="full" alignItems="flex-start">
            <Button
              onClick={handleBrowser}
              colorScheme="primary"
              rightIcon={<BsChevronRight fontSize="0.8em" strokeWidth="1px" />}
            >
              Browser Account File
            </Button>
          </VStack>
        </VStack>
      ) : (
        <VStack
          w="full"
          align="flex-start"
          alignSelf="center"
          justify="center"
          flex={1}
          spacing={1}
          marginTop="0rem"
        >
          <Text fontSize="1.7em" fontWeight="black">
            Confirm Details
          </Text>
          <Button
            variant="link"
            leftIcon={<BiRadar fontSize="1.2em" />}
            size="sm"
            href={`http://etherscan.io/address/${account.address}`}
            as="a"
            target="_blank"
          >
            Check on EtherScan
          </Button>
          <VStack pt="2em" gap="1em" w="full" alignItems="flex-start">
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
                        href={`http://etherscan.io/address/${account.address}`}
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
            <Button
              onClick={handleConfirm}
              colorScheme="primary"
              rightIcon={<BsChevronRight fontSize="0.8em" strokeWidth="1px" />}
            >
              Confirm
            </Button>
          </VStack>
        </VStack>
      )}
      <Button
        variant="link"
        colorScheme="gray"
        onClick={() => navigate(-1)}
        leftIcon={<FiChevronLeft strokeWidth="3px" />}
      >
        Back
      </Button>
    </VStack>
  );
};

export default AlreadyHaveAnAccount;
