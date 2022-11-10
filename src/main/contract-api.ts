import { ethers } from 'ethers';
import FactoryABI from '../factory-abi';
import StorageABI from '../storage-abi';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const providerAddress = 'http://127.0.0.1:8545/';

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
  async getStorageNodesAddress() {
    console.log('Getting nodes');
    const ifc = new ethers.utils.Interface(FactoryABI);
    const nodeIfc = new ethers.utils.Interface(StorageABI);

    const factory = new ethers.Contract(
      contractAddress,
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
