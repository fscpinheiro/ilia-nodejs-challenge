import express from 'express';
import { env } from './config';
import { PrismaUserRepository } from './infrastructure/database';
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
const userController = new UserController(
  createUser,
  listUsers,
  getUser,
  updateUser,
  deleteUser,
);
const authController = new AuthController(authenticate);

// Routes
app.use(createUserRoutes(userController, authController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-users' });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`ms-users running on port ${env.port}`);
});
