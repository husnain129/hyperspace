/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-brace-presence */
import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { BsBarChart } from 'react-icons/bs';
import { HiMenuAlt2, HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbLayoutDashboard } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import BladeSpinner from 'renderer/components/blade-spinner/BladeSpinner';
import useAccount from 'renderer/hooks/useAccount';
import hyperspace from '../../../assets/hyperspace.svg';

import EthLogo from '../../../assets/ethereum-eth-logo.svg';

export enum NAVIGATION {
  DASHBOARD,
  NODES,
  ACCOUNT,
}

const Sidebar = ({ activeNavigation }: { activeNavigation: NAVIGATION }) => {
  const navigate = useNavigate();
  const selected = activeNavigation;
  const selectedStyle = (selectedNav: NAVIGATION) => ({
    bg: selected === selectedNav ? 'primary.500' : 'transparent',
    color: selected === selectedNav ? '#fff' : '#6A6A6A',
  });
  const { account } = useAccount();
  const [blncLoading, setBlncLoading] = useState(false);
  const [balance, setBalance] = useState('');
  const getAccountBalance = useCallback(() => {
    setBlncLoading(true);
    setTimeout(async () => {
      try {
        const blnc = await window.electron.ipcRenderer.invoke(
          'get-balance',
          account.address
        );

        const eth = Intl.NumberFormat('en', {
          maximumFractionDigits: 4,
        }).format(Number(ethers.utils.formatEther(blnc)));

        setBalance(eth);
      } catch (er) {
        console.warn(er);
      } finally {
        setBlncLoading(false);
      }
    }, 1000);
  }, [account.address]);

  useEffect(() => {
    getAccountBalance();
  }, [getAccountBalance]);

  return (
    <VStack
      minW="250px"
      w="250px"
      h="full"
      borderRight="1px solid #F2F2F2"
      justifyContent="space-between"
      alignItems="center"
      px="1.5em"
      pt="2em"
      pb="1rem"
    >
      <VStack
        w="full"
        h="full"
        gap={'2em'}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Flex gap="1em" alignItems={'center'} pl="0.2em">
          <Image
            src={EthLogo}
            borderRadius="full"
            h="2.5rem"
            alt="user"
            objectFit="cover"
          />
          <Flex flexDir={'column'} alignItems="flex-start" gap="0.2em">
            <Text color="#494949" fontSize="1em" fontWeight="bold">
              {account.name}
            </Text>
            <Flex gap=".5em" color="gray.500" align={'center'} h="1rem">
              {/* ICON here */}
              <Text
                fontSize="0.8em"
                fontFamily={'mono'}
                fontWeight="semibold"
                color="gray.500"
              >
                Ξ
              </Text>
              {blncLoading ? (
                <BladeSpinner size="sm" />
              ) : (
                <>
                  <Text
                    fontSize="0.8em"
                    fontFamily={'mono'}
                    fontWeight="semibold"
                    color="gray.500"
                  >
                    {balance}
                  </Text>
                  <Box
                    transition="all 0.1s ease-in-out"
                    _hover={{
                      transform: 'rotate(45deg)',
                    }}
                  >
                    <BiRefresh
                      onClick={() => {
                        getAccountBalance();
                      }}
                    />
                  </Box>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir={'column'} gap=".5em" w="100%">
          <HStack
            transition="all 0.1s ease-in-out"
            {...selectedStyle(NAVIGATION.DASHBOARD)}
            w="full"
            h="2.4em"
            borderRadius={'4px'}
            cursor={'pointer'}
            _hover={{
              ...(selected !== 0 ? { background: 'gray.200' } : {}),
              // color: '#',
            }}
            alignItems={'center'}
            justifyContent="flex-start"
            gap={'0.2em'}
            pl={'1.2em'}
            onClick={() => {
              navigate('/');
            }}
          >
            <TbLayoutDashboard size={'1em'} />
            <Text fontSize={'.9em'} fontWeight="semibold">
              Dashboard
            </Text>
          </HStack>
          <HStack
            transition="all 0.1s ease-in-out"
            {...selectedStyle(NAVIGATION.NODES)}
            w="full"
            h="2.4em"
            borderRadius={'4px'}
            cursor={'pointer'}
            _hover={{
              ...(selected !== 1 ? { background: 'gray.200' } : {}),
              // color: '#',
            }}
            alignItems={'center'}
            justifyContent="flex-start"
            pl={'1.2em'}
            gap="0.2em"
            onClick={() => {
              navigate('/nodes');
            }}
          >
            <BsBarChart size={'1em'} />
            <Text fontSize={'.9em'} fontWeight="semibold">
              Nodes
            </Text>
          </HStack>
          <HStack
            transition="all 0.1s ease-in-out"
            {...selectedStyle(NAVIGATION.ACCOUNT)}
            w="full"
            h="2.4em"
            borderRadius={'4px'}
            cursor={'pointer'}
            _hover={{
              ...(selected !== 2 ? { background: 'gray.200' } : {}),
              // color: '#',
            }}
            alignItems={'center'}
            justifyContent="flex-start"
            gap={'0.2em'}
            pl={'1.2em'}
            onClick={() => {
              // setSelected(2);
              navigate('/account');
            }}
          >
            <IoSettingsOutline size={'1em'} />
            <Text fontSize={'.9em'} fontWeight="semibold">
              Account
            </Text>
          </HStack>
        </Flex>
      </VStack>
      <Flex
        borderTop="1px solid"
        borderColor="gray.200"
        pt="1rem"
        w="full"
        justify="center"
      >
        <Image src={hyperspace} h="2em" alignSelf={'center'} />
      </Flex>
      {/* <Button
        // w="90%"
        colorScheme={'blackAlpha'}
        variant={'ghost'}
        leftIcon={<HiOutlineArrowNarrowLeft />}
        onClick={() => navigate('/auth')}
      >
        Logout
      </Button> */}
    </VStack>
  );
};

export default Sidebar;
