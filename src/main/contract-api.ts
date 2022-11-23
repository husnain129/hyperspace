import { ethers } from 'ethers';
import FactoryABI from '../factory-abi';
import StorageABI from '../storage-abi';

const factoryContractAddress = '0xC6906Df3A9268729EDB78F8eF1E31F59b70DA857';
const providerAddress = 'http://127.0.0.1:7545';

// eslint-disable-next-line import/prefer-default-export
export const ContractAPI = {
  provider: null as ethers.providers.JsonRpcProvider | null,
  getProvider() {
    if (this.provider == null)
      this.provider = new ethers.providers.JsonRpcProvider(providerAddress);
    return this.provider;
  },
  async getBalance(address: string) {
    return this.getProvider().getBalance(address);
  },
  async concludeTransaction(
    contractAddress: string,
    privateKey: string,
    wei: string,
    data: {
      userAddress: string;
      merkleRootHash: string;
      fileSize: number;
      timerStart: number;
      timerEnd: number;
      proveTimeoutLength: number;
      concludeTimeoutLength: number;
      segmentsCount: number;
      bidAmount: string;
    }
  ) {
    const signer = new ethers.Wallet(privateKey, this.getProvider());
    const nodeIfc = new ethers.utils.Interface(StorageABI);

    const contract = new ethers.Contract(contractAddress, nodeIfc, signer);
    const tx = await contract.concludeTransaction(
      1,
      data.userAddress,
      ethers.utils.arrayify(`0x${data.merkleRootHash}`),
      data.fileSize,
      data.timerStart,
      data.timerEnd,
      data.proveTimeoutLength,
      data.concludeTimeoutLength,
      data.segmentsCount,
      BigInt(data.bidAmount),
      { value: BigInt(wei) }
    );
    return true;
  },
  async getStorageNodesAddress() {
    console.log('Getting nodes');
    const ifc = new ethers.utils.Interface(FactoryABI);
    const nodeIfc = new ethers.utils.Interface(StorageABI);

    const factory = new ethers.Contract(
      factoryContractAddress,
      ifc,
      this.getProvider()
    );

    const addrs: string[] = await factory.getStorageContracts();
    const nodes = await Promise.all(
      addrs.map(async (addr, i) => {
        const contract = new ethers.Contract(
          addr,
          nodeIfc,
          new ethers.providers.JsonRpcProvider(providerAddress)
        );

        const host = await contract.HOST();
        const tlsCert = await contract.TLSCert();
        const owner = await contract.owner();
        return { host, tlsCert, owner, address: addr };
      })
    );
    return nodes;
  },
};
