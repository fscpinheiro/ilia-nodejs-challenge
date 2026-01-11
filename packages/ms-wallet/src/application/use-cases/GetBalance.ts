import { TransactionRepository } from '../../domain/repositories';

export interface GetBalanceInput {
  userId: string;
}

export interface GetBalanceOutput {
  amount: number;
}

export class GetBalance {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: GetBalanceInput): Promise<GetBalanceOutput> {
    const balance = await this.transactionRepository.getBalance(input.userId);

    return {
      amount: balance.amount,
    };
  }
}
