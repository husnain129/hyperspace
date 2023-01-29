import { ethers } from 'ethers';
import FactoryABI from '../factory-abi';
import StorageABI from '../storage-abi';

const factoryContractAddress = '0xBD58bc10541F1e91d2759FCCB23F5454c8598cfB';
// const providerAddress = 'http://127.0.0.1:7545';
const providerAddress =
  'https://opt-goerli.g.alchemy.com/v2/lLvcVplpamR-7ZTitncsc_qSPkenwum9';

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
    console.log('Params');
    console.log(
      1,
      data.userAddress,
      ethers.utils.arrayify(`0x${data.merkleRootHash}`),
      data.fileSize,
      data.timerStart,
      data.timerEnd,
      data.proveTimeoutLength,
      data.concludeTimeoutLength,
      data.segmentsCount,
      BigInt(data.bidAmount)
    );
    console.log('>Conclude Timeout:', data.concludeTimeoutLength);
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
  async getStorageNodeInfo(contractAddress: string) {
    console.log('Getting node info');
    const nodeIfc = new ethers.utils.Interface(StorageABI);

    const contract = new ethers.Contract(
      contractAddress,
      nodeIfc,
      new ethers.providers.JsonRpcProvider(providerAddress)
    );

    const host: string = await contract.HOST();
    const tlsCert: string = await contract.TLSCert();
    const owner: string = await contract.owner();
    return { host, tlsCert, owner, address: contractAddress };
  },
};
