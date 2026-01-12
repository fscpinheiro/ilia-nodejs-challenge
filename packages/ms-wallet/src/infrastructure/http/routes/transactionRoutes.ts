import { Router } from 'express';
import { TransactionController } from '../controllers';
import { authMiddleware } from '../middlewares';

export function createTransactionRoutes(controller: TransactionController): Router {
  const router = Router();

  router.post('/transactions', authMiddleware, (req, res, next) =>
    controller.create(req, res, next),
  );

  router.get('/transactions', authMiddleware, (req, res, next) => controller.list(req, res, next));

  router.get('/balance', authMiddleware, (req, res, next) => controller.balance(req, res, next));

  return router;
}
