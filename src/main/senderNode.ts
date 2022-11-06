/* eslint-disable import/prefer-default-export */
import { ethers } from 'ethers';

const Ether = () => {
  return {
    newVallet: () => {
      return ethers.Wallet.createRandom();
    },
  };
};

export { Ether };
