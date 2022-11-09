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
        <Flex gap=".8em" alignItems={'center'} pl="0.2em">
          <Image
            src="https://i.ebayimg.com/images/g/w9kAAOSwZp5fIhxW/s-l800.jpg"
            borderRadius="full"
            w="3em"
            h="3em"
            alt="user"
            objectFit="cover"
          />
          <Flex flexDir={'column'} alignItems="flex-start" gap="0.2em">
            <Text color="#494949" fontSize="1em" fontWeight="bold">
              Mark Zuck
            </Text>
            <Flex gap=".5em" color="gray.500" align={'center'}>
              {/* ICON here */}
              <Text
                fontSize="0.8em"
                // fontFamily={'mono'}
                fontWeight="bold"
                color="gray.500"
              >
                Ξ 3.2
              </Text>
              <BiRefresh />
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDir={'column'} gap=".5em" w="100%">
          <HStack
            transition="all 0.1s ease-in-out"
            {...selectedStyle(0)}
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
              setSelected(0);
            }}
          >
            <TbLayoutDashboard size={'1em'} />
            <Text fontSize={'.9em'} fontWeight="semibold">
              Dashboard
            </Text>
          </HStack>
          <HStack
            transition="all 0.1s ease-in-out"
            {...selectedStyle(1)}
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
              setSelected(1);
            }}
          >
            <BsBarChart size={'1em'} />
            <Text fontSize={'.9em'} fontWeight="semibold">
              Nodes
            </Text>
          </HStack>
          <HStack
            transition="all 0.1s ease-in-out"
            {...selectedStyle(2)}
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
              setSelected(2);
            }}
          >
            <IoSettingsOutline size={'1em'} />
            <Text fontSize={'.9em'} fontWeight="semibold">
              Configuration
            </Text>
          </HStack>
        </Flex>
      </VStack>
      <Button
        // w="90%"
        colorScheme={'blackAlpha'}
        variant={'ghost'}
        leftIcon={<HiOutlineArrowNarrowLeft />}
        onClick={() => navigate('/auth')}
      >
        Logout
      </Button>
    </VStack>
  );
};

export default Sidebar;
