// Nov 9, 2022
const StorageABI = `[
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_TLSCert",
        "type": "bytes"
      },
      {
        "internalType": "string",
        "name": "_HOST",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "fileMerkleRootHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "expiryTimestamp",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "segmentIndex",
        "type": "uint32"
      }
    ],
    "name": "EvProveStorage",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "fileMerkleRootHash",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "EvValidationExpired",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "fileMerkleRoot",
        "type": "bytes32"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "segmentIndex",
        "type": "uint32"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "EvValidationSubmitted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "HOST",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TLSCert",
    "outputs": [
      {
        "internalType": "bytes",
        "name": "",
        "type": "bytes"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "merkleRootHash",
        "type": "bytes32"
      }
    ],
    "name": "computeKey",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum StorageNode.CallerType",
        "name": "callerType",
        "type": "uint8"
      },
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "merkleRootHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint32",
        "name": "fileSize",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "timerStart",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timerEnd",
        "type": "uint256"
      },
      {
        "internalType": "uint64",
        "name": "proveTimeoutLength",
        "type": "uint64"
      },
      {
        "internalType": "uint64",
        "name": "concludeTimeoutLength",
        "type": "uint64"
      },
      {
        "internalType": "uint32",
        "name": "segmentsCount",
        "type": "uint32"
      },
      {
        "internalType": "uint256",
        "name": "bidAmount",
        "type": "uint256"
      }
    ],
    "name": "concludeTransaction",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "merkleRootHash",
        "type": "bytes32"
      }
    ],
    "name": "finishTransaction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "lockedCollateral",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mappingLength",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
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
    "name": "mappingsList",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "rootHash",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      },
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      }
    ],
    "name": "processValidation",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "fileRootHash",
        "type": "bytes32"
      },
      {
        "internalType": "uint32",
        "name": "segmentIndex",
        "type": "uint32"
      }
    ],
    "name": "validateStorage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "rootHash",
        "type": "bytes32"
      }
    ],
    "name": "validationExpired",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32[]",
        "name": "proof",
        "type": "bytes32[]"
      },
      {
        "internalType": "bytes32",
        "name": "root",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "leaf",
        "type": "bytes32"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "verify",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "target",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]`;

export default StorageABI;
