// Original file: ../storage-node-p1/proto/storage-node.proto

import type { Long } from '@grpc/proto-loader';

export interface InitTransactionRequest {
  'fileSize'?: (number | string | Long);
  'segmentsCount'?: (number);
  'fileHash'?: (string);
  'bid'?: (number | string | Long);
  'timeperiod'?: (number | string | Long);
}

export interface InitTransactionRequest__Output {
  'fileSize': (Long);
  'segmentsCount': (number);
  'fileHash': (string);
  'bid': (Long);
  'timeperiod': (Long);
}
