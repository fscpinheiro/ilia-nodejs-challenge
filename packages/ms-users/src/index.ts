import express from 'express';
import { env } from './config';
import { PrismaUserRepository, seedAdminUser } from './infrastructure/database';
import {
  CreateUser,
  ListUsers,
  GetUser,
  UpdateUser,
  DeleteUser,
  Authenticate,
} from './application/use-cases';
import { UserController, AuthController } from './infrastructure/http/controllers';
import { createUserRoutes } from './infrastructure/http/routes';
import { errorHandler } from './infrastructure/http/middlewares';
import { createGrpcServer, startGrpcServer } from './infrastructure/grpc';

const app = express();

app.use(express.json());

// Repository
const userRepository = new PrismaUserRepository();

// Use cases
const createUser = new CreateUser(userRepository);
const listUsers = new ListUsers(userRepository);
const getUser = new GetUser(userRepository);
const updateUser = new UpdateUser(userRepository);
const deleteUser = new DeleteUser(userRepository);
const authenticate = new Authenticate(userRepository, env.jwtSecret);

// Controllers
const userController = new UserController(createUser, listUsers, getUser, updateUser, deleteUser);
const authController = new AuthController(authenticate);

// Routes
app.use(createUserRoutes(userController, authController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-users' });
});

// Error handler (must be last)
app.use(errorHandler);

// Start application
async function bootstrap(): Promise<void> {
  // Seed admin user if database is empty
  await seedAdminUser();

  // Start HTTP server
  app.listen(env.port, () => {
    console.log(`ms-users HTTP running on port ${env.port}`);
  });

  // Start gRPC server
  const grpcServer = createGrpcServer(userRepository);
  startGrpcServer(grpcServer, env.grpcPort);
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
