// Original file: ../storage-node-p1/proto/storage-node.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _proto_Empty, Empty__Output as _proto_Empty__Output } from '../proto/Empty';
import type { GetStatsResponse as _proto_GetStatsResponse, GetStatsResponse__Output as _proto_GetStatsResponse__Output } from '../proto/GetStatsResponse';
import type { InitTransactionRequest as _proto_InitTransactionRequest, InitTransactionRequest__Output as _proto_InitTransactionRequest__Output } from '../proto/InitTransactionRequest';
import type { InitTransactionResponse as _proto_InitTransactionResponse, InitTransactionResponse__Output as _proto_InitTransactionResponse__Output } from '../proto/InitTransactionResponse';
import type { PingRequest as _proto_PingRequest, PingRequest__Output as _proto_PingRequest__Output } from '../proto/PingRequest';
import type { PingResponse as _proto_PingResponse, PingResponse__Output as _proto_PingResponse__Output } from '../proto/PingResponse';

export interface StorageNodeClient extends grpc.Client {
  GetStats(argument: _proto_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  GetStats(argument: _proto_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  GetStats(argument: _proto_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  GetStats(argument: _proto_Empty, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  getStats(argument: _proto_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  getStats(argument: _proto_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  getStats(argument: _proto_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  getStats(argument: _proto_Empty, callback: grpc.requestCallback<_proto_GetStatsResponse__Output>): grpc.ClientUnaryCall;
  
  InitTransaction(argument: _proto_InitTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  InitTransaction(argument: _proto_InitTransactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  InitTransaction(argument: _proto_InitTransactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  InitTransaction(argument: _proto_InitTransactionRequest, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  initTransaction(argument: _proto_InitTransactionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  initTransaction(argument: _proto_InitTransactionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  initTransaction(argument: _proto_InitTransactionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  initTransaction(argument: _proto_InitTransactionRequest, callback: grpc.requestCallback<_proto_InitTransactionResponse__Output>): grpc.ClientUnaryCall;
  
  Ping(argument: _proto_PingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  Ping(argument: _proto_PingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  Ping(argument: _proto_PingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  Ping(argument: _proto_PingRequest, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  ping(argument: _proto_PingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  ping(argument: _proto_PingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  ping(argument: _proto_PingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  ping(argument: _proto_PingRequest, callback: grpc.requestCallback<_proto_PingResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface StorageNodeHandlers extends grpc.UntypedServiceImplementation {
  GetStats: grpc.handleUnaryCall<_proto_Empty__Output, _proto_GetStatsResponse>;
  
  InitTransaction: grpc.handleUnaryCall<_proto_InitTransactionRequest__Output, _proto_InitTransactionResponse>;
  
  Ping: grpc.handleUnaryCall<_proto_PingRequest__Output, _proto_PingResponse>;
  
}

export interface StorageNodeDefinition extends grpc.ServiceDefinition {
  GetStats: MethodDefinition<_proto_Empty, _proto_GetStatsResponse, _proto_Empty__Output, _proto_GetStatsResponse__Output>
  InitTransaction: MethodDefinition<_proto_InitTransactionRequest, _proto_InitTransactionResponse, _proto_InitTransactionRequest__Output, _proto_InitTransactionResponse__Output>
  Ping: MethodDefinition<_proto_PingRequest, _proto_PingResponse, _proto_PingRequest__Output, _proto_PingResponse__Output>
}
