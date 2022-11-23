// Original file: assets/storage-node.proto

import type { Long } from '@grpc/proto-loader';

export interface InitTransactionRequest {
  'fileSize'?: (number | string | Long);
  'segmentsCount'?: (number | string | Long);
  'fileHash'?: (string);
  'bid'?: (string);
  'userAddress'?: (string);
  'timeStart'?: (number | string | Long);
  'timeEnd'?: (number | string | Long);
  'concludeTimeout'?: (number | string | Long);
  'ProveTimeout'?: (number | string | Long);
}

export interface InitTransactionRequest__Output {
  'fileSize': (Long);
  'segmentsCount': (Long);
  'fileHash': (string);
  'bid': (string);
  'userAddress': (string);
  'timeStart': (Long);
  'timeEnd': (Long);
  'concludeTimeout': (Long);
  'ProveTimeout': (Long);
}
