/* eslint-disable react/destructuring-assignment */
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
import { IAccount } from 'main/db-api';

const CreateAccount = (props: {
  onAccountCreated: (account: IAccount) => void;
}) => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [step, setStep] = useState<'NAME' | 'KEY'>('NAME');
  const [keyValid, setKeyValid] = useState(false);
  const [key, setKey] = useState('');
  const handleGenerateNew = () => {
    const w = ethers.Wallet.createRandom();
    setKey(w.privateKey);
    setKeyValid(true);
  };

  const [sumbitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    console.log('>Submit');
    if (!(key.length === 66 || key.length === 64) || name.length < 3) return;
    setSubmitting(true);

    try {
      const privateKey = key.length === 64 ? `0x${key}` : key;
      const publicKey = ethers.utils.computePublicKey(privateKey);
      const address = ethers.utils.computeAddress(publicKey);
      console.log('Create-account');
      await window.electron.ipcRenderer.invoke('create-account', {
        name,
        private_key: privateKey,
        public_key: publicKey,
        address,
        created_at: Date.now(),
      } as IAccount);
      const acc = (await window.electron.ipcRenderer.invoke(
        'get-account'
      )) as IAccount; // confirmation

      props.onAccountCreated(acc);
    } catch (er) {
      console.warn(er);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyKey = (pkey: string) => {
    if (!(pkey.length === 66 || pkey.length === 64) || name.length < 3) {
      return false;
    }
    let k = pkey;
    if (pkey.startsWith('0x')) {
      k = k.slice(2);
    }
    if (!k.match(/[0-9A-F]/gi)) {
      return false;
    }
    return true;
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
          marginTop="0rem"
        >
          <Text fontSize="1.7em" fontWeight="black">
            What should we call you?
          </Text>
          <VStack pt="2em" gap="1em" w="full" alignItems="flex-start">
            <Input
              placeholder="Enter your name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              isDisabled={name.length < 3}
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
          marginTop="4rem"
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
              placeholder="Enter your private key in hex format"
              onChange={(e) => {
                setKey(e.target.value);
                setKeyValid(verifyKey(e.target.value));
              }}
              value={key}
              fontFamily="mono"
              fontSize="0.9em"
            />

            <HStack gap="1em">
              <Button
                onClick={() => handleSubmit()}
                type="button"
                colorScheme="primary"
                rightIcon={
                  <BsChevronRight fontSize="0.8em" strokeWidth="1px" />
                }
                isDisabled={!keyValid}
                isLoading={sumbitting}
              >
                Next
              </Button>
              <Button variant="ghost" onClick={handleGenerateNew}>
                Generate New
              </Button>
            </HStack>
            <Text fontSize="sm" fontWeight="500" color="red.500" minH="1em">
              {key.length > 0 && !keyValid
                ? 'Private key is not valid. Only hexadecimal characters are allowed.'
                : ''}
            </Text>
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

export default CreateAccount;
