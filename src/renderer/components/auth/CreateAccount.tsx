/* eslint-disable react/no-children-prop */
import {
  Button,
  Flex,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import * as ethers from 'ethers';

const CreateAccount = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<'NAME' | 'KEY'>('NAME');

  const [key, setKey] = useState('');
  const handleGenerateNew = () => {
    const w = ethers.Wallet.createRandom();
    setKey(w.privateKey);
  };

  return (
    <VStack
      w="full"
      alignItems="flex-start"
      h="full"
      justifyContent="flex-start"
    >
      {step === 'NAME' && (
        <VStack
          w="full"
          align="flex-start"
          alignSelf="center"
          justify="center"
          flex={1}
          spacing={1}
          marginTop="-4rem"
        >
          <Text fontSize="1.7em" fontWeight="black">
            What should we call you?
          </Text>
          <VStack pt="2em" gap="1em" w="full" alignItems="flex-start">
            <Input placeholder="Enter your name" autoFocus />
            <Button
              onClick={() => setStep('KEY')}
              colorScheme="primary"
              rightIcon={<BsChevronRight fontSize="0.8em" strokeWidth="1px" />}
            >
              Next
            </Button>
          </VStack>
        </VStack>
      )}
      {step === 'KEY' && (
        <VStack
          w="full"
          align="flex-start"
          alignSelf="center"
          justify="center"
          flex={1}
          spacing={3}
          marginTop="-4rem"
        >
          <Text fontSize="1.5em" fontWeight="black">
            Your account private key
          </Text>
          <Text color="gray.500" fontSize="0.85em">
            You can export your Metamask wallet private key from configuration
            menu.
          </Text>
          <VStack gap="1em" w="full" alignItems="flex-start">
            <Textarea
              autoFocus
              placeholder="Enter your private key"
              onChange={(e) => setKey(e.target.value)}
              value={key}
              fontFamily="mono"
              fontSize="0.9em"
            />
            <HStack gap="1em">
              <Button
                onClick={() => navigate('/')}
                colorScheme="primary"
                rightIcon={
                  <BsChevronRight fontSize="0.8em" strokeWidth="1px" />
                }
              >
                Next
              </Button>
              <Button variant="ghost" onClick={handleGenerateNew}>
                Generate New
              </Button>
            </HStack>
          </VStack>
        </VStack>
      )}
      <Flex
        marginTop="auto"
        gap=".2em"
        cursor="pointer"
        alignItems="center"
        justifyContent="center"
        onClick={() => navigate(-1)}
      >
        <FiChevronLeft />
        <Text>Back</Text>
      </Flex>
    </VStack>
  );
};

export default CreateAccount;
