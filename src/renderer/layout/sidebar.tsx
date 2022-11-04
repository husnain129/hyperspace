/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-brace-presence */
import { Button, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { BsBarChart } from 'react-icons/bs';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbLayoutDashboard } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import hyperspace from '../../../assets/hyperspace.svg';

const Sidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const selectedStyle = (selectedNumber: number) => ({
    bg: selected === selectedNumber ? 'primary.500' : 'transparent',
    color: selected === selectedNumber ? '#fff' : '#6A6A6A',
  });
  return (
    <VStack
      w="25%"
      h="full"
      bg="white"
      shadow="lg"
      borderRadius={'lg'}
      justifyContent="space-between"
      alignItems="center"
      py="2em"
      px="1em"
    >
      <VStack
        w="full"
        h="full"
        gap={'5em'}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <HStack>
          <Image src={hyperspace} alt="logo" w="3em" h="3em" />
          <Flex
            flexDir={'column'}
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Text fontWeight={'semibold'}>
              HYPER<span style={{ color: '#7D7D7D' }}>SPACE</span>
            </Text>
            <Text mt="-6px" fontSize={'.75em'}>
              Storage Node
            </Text>
          </Flex>
        </HStack>
        <Flex flexDir={'column'} gap=".2em" w="100%">
          <HStack
            {...selectedStyle(0)}
            w="full"
            h="3em"
            borderRadius={'md'}
            cursor={'pointer'}
            _hover={{
              background: 'primary.500',
              color: '#fff',
            }}
            alignItems={'center'}
            justifyContent="flex-start"
            gap={'.2em'}
            pl={'1.2em'}
            onClick={() => setSelected(0)}
          >
            <TbLayoutDashboard size={'1.2em'} />
            <Text fontSize={'.95em'}>Dashboard</Text>
          </HStack>
          <HStack
            {...selectedStyle(1)}
            w="full"
            h="3em"
            borderRadius={'md'}
            cursor={'pointer'}
            _hover={{
              background: 'primary.500',
              color: '#fff',
            }}
            alignItems={'center'}
            justifyContent="flex-start"
            pl={'1.2em'}
            onClick={() => setSelected(1)}
          >
            <BsBarChart size={'1.2em'} />
            <Text fontSize={'.95em'}>Analsys</Text>
          </HStack>
          <HStack
            {...selectedStyle(2)}
            w="full"
            h="3em"
            borderRadius={'md'}
            cursor={'pointer'}
            _hover={{
              background: 'primary.500',
              color: '#fff',
            }}
            alignItems={'center'}
            justifyContent="flex-start"
            gap={'.2em'}
            pl={'1.2em'}
            onClick={() => setSelected(2)}
          >
            <IoSettingsOutline size={'1.2em'} />
            <Text fontSize={'.95em'}>Configuration</Text>
          </HStack>
        </Flex>
      </VStack>
      <Button
        w="90%"
        colorScheme={'red'}
        leftIcon={<HiOutlineArrowNarrowLeft />}
        onClick={() => navigate('/auth')}
      >
        Logout
      </Button>
    </VStack>
  );
};

export default Sidebar;
