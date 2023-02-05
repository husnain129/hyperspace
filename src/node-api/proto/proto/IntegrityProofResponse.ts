// Original file: assets/storage-node.proto

import type { Long } from '@grpc/proto-loader';

export interface IntegrityProofResponse {
  'root'?: (Buffer | Uint8Array | string);
  'SegmentIndex'?: (number | string | Long);
  'segmentsCount'?: (number | string | Long);
  'proof'?: (Buffer | Uint8Array | string)[];
  'directions'?: (number)[];
  'data'?: (Buffer | Uint8Array | string);
}

export interface IntegrityProofResponse__Output {
  'root': (Buffer);
  'SegmentIndex': (Long);
  'segmentsCount': (Long);
  'proof': (Buffer)[];
  'directions': (number)[];
  'data': (Buffer);
}
