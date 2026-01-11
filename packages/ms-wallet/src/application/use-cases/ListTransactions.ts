import { TransactionType } from '../../domain/entities';
import { TransactionRepository } from '../../domain/repositories';

export interface ListTransactionsInput {
  type?: TransactionType;
}

export interface ListTransactionsOutput {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  created_at: Date;
}

export class ListTransactions {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input?: ListTransactionsInput): Promise<ListTransactionsOutput[]> {
    const transactions = await this.transactionRepository.findAll({
      type: input?.type,
    });

    return transactions.map((transaction) => ({
      id: transaction.id!,
      user_id: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      created_at: transaction.createdAt,
    }));
  }
}
