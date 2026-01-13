import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../domain/repositories';
import { env, logger } from '../../config';

// gRPC message types
interface ValidateUserRequest {
  user_id: string;
  token: string;
}

interface ValidateUserResponse {
  valid: boolean;
  user_id: string;
}

const PROTO_PATH = path.resolve(__dirname, '../../../../proto/users.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const usersProto = grpc.loadPackageDefinition(packageDefinition) as any;

export function createGrpcServer(userRepository: UserRepository): grpc.Server {
  const server = new grpc.Server();

  server.addService(usersProto.users.UserService.service, {
    validateUser: async (
      call: grpc.ServerUnaryCall<ValidateUserRequest, ValidateUserResponse>,
      callback: grpc.sendUnaryData<ValidateUserResponse>,
    ) => {
      try {
        const { user_id, token } = call.request;

        // Validate internal token
        try {
          jwt.verify(token, env.jwtInternalSecret);
        } catch {
          return callback(null, { valid: false, user_id: '' });
        }

        // Check if user exists
        const user = await userRepository.findById(user_id);

        if (!user) {
          return callback(null, { valid: false, user_id: '' });
        }

        callback(null, { valid: true, user_id: user.id ?? '' });
      } catch (error) {
        callback(null, { valid: false, user_id: '' });
      }
    },
  });

  return server;
}

export function startGrpcServer(server: grpc.Server, port: number): void {
  server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, boundPort) => {
    if (err) {
      logger.error('Failed to start gRPC server:');
      logger.error(err);
      return;
    }
    logger.info(`gRPC server running on port ${boundPort}`);
  });
}
