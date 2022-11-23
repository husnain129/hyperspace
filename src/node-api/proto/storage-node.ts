import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { StorageNodeClient as _proto_StorageNodeClient, StorageNodeDefinition as _proto_StorageNodeDefinition } from './proto/StorageNode';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  proto: {
    Empty: MessageTypeDefinition
    GetStatsResponse: MessageTypeDefinition
    InitTransactionRequest: MessageTypeDefinition
    InitTransactionResponse: MessageTypeDefinition
    PingRequest: MessageTypeDefinition
    PingResponse: MessageTypeDefinition
    StorageNode: SubtypeConstructor<typeof grpc.Client, _proto_StorageNodeClient> & { service: _proto_StorageNodeDefinition }
  }
}

