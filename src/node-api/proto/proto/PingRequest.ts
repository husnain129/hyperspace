// Original file: ../storage-node-p1/proto/storage-node.proto

import type { Long } from '@grpc/proto-loader';

export interface PingRequest {
  'fileSize'?: (number | string | Long);
  'segmentsCount'?: (number);
  'bidPrice'?: (string);
  'timePeriod'?: (number | string | Long);
}

export interface PingRequest__Output {
  'fileSize': (Long);
  'segmentsCount': (number);
  'bidPrice': (string);
  'timePeriod': (Long);
}
