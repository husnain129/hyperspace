import { ethers } from 'ethers';

export function merkleHash(bytes: Buffer) {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(['bytes'], [ethers.utils.arrayify(bytes)])
      .slice(2),
    'hex'
  );
}
export function merkleVerify(
  proof: Buffer[],
  root: Buffer,
  leafData: Buffer,
  index: number
): Buffer {
  let tIndex = index;
  let hash = merkleHash(leafData);

  for (let i = 0; i < proof.length; i += 1) {
    const proofElement = proof[i];

    if (tIndex % 2 === 0) {
      const b = Buffer.concat([hash, proofElement]);
      hash = merkleHash(b);
    } else {
      const b = Buffer.concat([proofElement, hash]);
      hash = merkleHash(b);
    }

    console.log('>', hash.toString('hex'));

    tIndex /= 2;
  }

  // return hash === root;
  return hash;
}
