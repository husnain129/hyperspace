/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-curly-brace-presence */
import { Button, Flex, HStack, Image, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { BiRefresh } from 'react-icons/bi';
import { BsBarChart } from 'react-icons/bs';
import { HiMenuAlt2, HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { IoSettingsOutline } from 'react-icons/io5';
import { TbLayoutDashboard } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);
  const selectedStyle = (selectedNumber: number) => ({
    bg: selected === selectedNumber ? 'primary.500' : 'transparent',
    color: selected === selectedNumber ? '#fff' : '#6A6A6A',
  });
  return (
    <VStack
      w="30%"
      h="full"
      borderRight="1px solid #F2F2F2"
      justifyContent="space-between"
      alignItems="center"
      px="1.5em"
      py="2em"
    >
      <VStack
        w="full"
        h="full"
        gap={'2em'}
        alignItems="flex-start"
        justifyContent="flex-start"
      >
        <Flex gap=".8em" alignItems={'center'}>
          <Image
            src="https://i.ebayimg.com/images/g/w9kAAOSwZp5fIhxW/s-l800.jpg"
            borderRadius="full"
            w="3.2em"
            h="3.2em"
            alt="user"
            objectFit="cover"
          />
          <Flex flexDir={'column'} alignItems="flex-start">
            <Text color="#494949" fontSize=".8em" fontWeight="semibold">
              Humayun Javed
            </Text>
            <Flex gap=".2em" color="#494949">
              <HiMenuAlt2 color="#494949" />
              <Text fontSize=".7em" color="#494949">
                3.2
              </Text>
              <BiRefresh color="#494949" />
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir={'column'} gap=".2em" w="100%">
          <HStack
            {...selectedStyle(0)}
            w="full"
            h="2.8em"
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
            h="2.8em"
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
            h="2.8em"
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
