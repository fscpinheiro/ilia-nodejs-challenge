import express from 'express';
import { env, logger } from './config';
import { PrismaTransactionRepository } from './infrastructure/database';
import { createUserClient } from './infrastructure/grpc';
import { CreateTransaction, ListTransactions, GetBalance } from './application/use-cases';
import { TransactionController } from './infrastructure/http/controllers';
import { createTransactionRoutes } from './infrastructure/http/routes';
import { errorHandler } from './infrastructure/http/middlewares';

const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ms-wallet' });
});

// Dependencies
const transactionRepository = new PrismaTransactionRepository();
const userClient = createUserClient(env.usersServiceUrl);

// Use cases
const createTransaction = new CreateTransaction(transactionRepository, userClient);
const listTransactions = new ListTransactions(transactionRepository);
const getBalance = new GetBalance(transactionRepository);

// Controller
const transactionController = new TransactionController(
  createTransaction,
  listTransactions,
  getBalance,
);

// Routes
app.use(createTransactionRoutes(transactionController));

// Error handler
app.use(errorHandler);

app.listen(env.port, () => {
  logger.info(`ms-wallet running on port ${env.port}`);
});
