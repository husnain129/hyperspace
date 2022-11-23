// Original file: assets/storage-node.proto

import type { Long } from '@grpc/proto-loader';

export interface InitTransactionResponse {
  'JWT'?: (string);
  'expiresAt'?: (number | string | Long);
  'httpURL'?: (string);
}

export interface InitTransactionResponse__Output {
  'JWT': (string);
  'expiresAt': (Long);
  'httpURL': (string);
}
