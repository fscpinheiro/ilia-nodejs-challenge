import { Transaction, TransactionType } from '../../domain/entities';
import { TransactionRepository } from '../../domain/repositories';

export interface CreateTransactionInput {
  userId: string;
  type: TransactionType;
  amount: number;
}

export interface CreateTransactionOutput {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  created_at: Date;
}

export class CreateTransaction {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: CreateTransactionInput): Promise<CreateTransactionOutput> {
    const transaction = new Transaction({
      userId: input.userId,
      type: input.type,
      amount: input.amount,
    });

    const created = await this.transactionRepository.create(transaction);

    return {
      id: created.id!,
      user_id: created.userId,
      type: created.type,
      amount: created.amount,
      created_at: created.createdAt,
    };
  }
}
