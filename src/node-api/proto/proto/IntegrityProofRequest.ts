// Original file: assets/storage-node.proto

import type { Long } from '@grpc/proto-loader';

export interface IntegrityProofRequest {
  'fileKey'?: (string);
  'segmentIndex'?: (number | string | Long);
}

export interface IntegrityProofRequest__Output {
  'fileKey': (string);
  'segmentIndex': (Long);
}
