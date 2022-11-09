// Original file: ../storage-node-p1/proto/storage-node.proto

import type { Long } from '@grpc/proto-loader';

export interface InitTransactionResponse {
  'JWT'?: (string);
  'expiresAt'?: (number | string | Long);
}

export interface InitTransactionResponse__Output {
  'JWT': (string);
  'expiresAt': (Long);
}
