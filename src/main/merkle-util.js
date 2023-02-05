/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-shadow */
import { ethers } from 'ethers';

const crypto = require('crypto');

const LEFT = 0;
const RIGHT = 1;

function keccak256(bytes) {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(['bytes'], [ethers.utils.arrayify(bytes)])
      .slice(2),
    'hex'
  );
}

// eslint-disable-next-line import/prefer-default-export
export function generateMerkleRootFromMerkleTreeDir(path, dir) {
  if (!path || path.length === 0) {
    return null;
  }
  const merkleRootFromProof = path.reduce((hashProof1, hashProof2, i) => {
    if (dir[i] === 1) {
      const hash = keccak256(Buffer.concat([hashProof1, hashProof2]));
      //   console.log(">", hash);
      return hash;
    }
    const hash = keccak256(Buffer.concat([hashProof2, hashProof1]));
    // console.log(">", hash);

    return hash;
  });
  return merkleRootFromProof;
}
