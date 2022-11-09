// Nov 9, 2022
const FactoryABI = `[
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "addr",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "TLSCert",
        "type": "bytes"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "host",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "EvNewStorageContract",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_TLSCert",
        "type": "bytes"
      },
      {
        "internalType": "string",
        "name": "_host",
        "type": "string"
      }
    ],
    "name": "createStorageContract",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getStorageContracts",
    "outputs": [
      {
        "internalType": "contract StorageNode[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "addr",
        "type": "address"
      }
    ],
    "name": "removeContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "storageContracts",
    "outputs": [
      {
        "internalType": "contract StorageNode",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]`;

export default FactoryABI;
