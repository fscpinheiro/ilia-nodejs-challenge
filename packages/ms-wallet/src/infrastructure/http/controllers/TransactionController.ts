import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { TransactionType } from '../../../domain/entities';
import { CreateTransaction, ListTransactions, GetBalance } from '../../../application/use-cases';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AppError } from '../middlewares/errorHandler';

const createTransactionSchema = z.object({
  user_id: z.string().min(1, 'user_id is required'),
  type: z.enum(['CREDIT', 'DEBIT']),
  amount: z.number().positive('amount must be greater than zero'),
});

const listTransactionsSchema = z.object({
  type: z.enum(['CREDIT', 'DEBIT']).optional(),
});

export class TransactionController {
  constructor(
    private createTransaction: CreateTransaction,
    private listTransactions: ListTransactions,
    private getBalance: GetBalance,
  ) {}

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validation = createTransactionSchema.safeParse(req.body);

      if (!validation.success) {
        throw new AppError(validation.error.errors[0].message, 400);
      }

      const { user_id, type, amount } = validation.data;

      const result = await this.createTransaction.execute({
        userId: user_id,
        type: type as TransactionType,
        amount,
      });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return next(new AppError('User not found', 404));
      }
      next(error);
    }
  }

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validation = listTransactionsSchema.safeParse(req.query);

      if (!validation.success) {
        throw new AppError(validation.error.errors[0].message, 400);
      }

      const { type } = validation.data;

      const result = await this.listTransactions.execute({
        type: type as TransactionType | undefined,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async balance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        throw new AppError('User ID not found in token', 401);
      }

      const result = await this.getBalance.execute({
        userId: req.userId,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
