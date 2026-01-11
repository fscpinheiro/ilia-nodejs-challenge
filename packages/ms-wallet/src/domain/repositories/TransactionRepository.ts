import { Transaction, TransactionType } from '../entities/Transaction';

export interface TransactionFilter {
  type?: TransactionType;
  userId?: string;
}

export interface BalanceResult {
  amount: number;
}

export interface TransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findAll(filter?: TransactionFilter): Promise<Transaction[]>;
  getBalance(userId: string): Promise<BalanceResult>;
}
