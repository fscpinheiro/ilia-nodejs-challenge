import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';
import jwt from 'jsonwebtoken';
import { env } from '../../config';

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

export interface UserClient {
  validateUser(userId: string): Promise<boolean>;
}

export function createUserClient(address: string): UserClient {
  const client = new usersProto.users.UserService(address, grpc.credentials.createInsecure());

  return {
    validateUser(userId: string): Promise<boolean> {
      return new Promise((resolve) => {
        const token = jwt.sign({}, env.jwtInternalSecret, { expiresIn: '1m' });

        client.validateUser(
          { user_id: userId, token } as ValidateUserRequest,
          (err: grpc.ServiceError | null, response?: ValidateUserResponse) => {
            if (err || !response) {
              resolve(false);
              return;
            }
            resolve(response.valid);
          },
        );
      });
    },
  };
}
