import { Transaction, TransactionType } from '../../domain/entities';
import { TransactionRepository, TransactionFilter, BalanceResult } from '../../domain/repositories';
import { prisma } from './prisma';

export class PrismaTransactionRepository implements TransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    const created = await prisma.transaction.create({
      data: {
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
      },
    });

    return new Transaction({
      id: created.id,
      userId: created.userId,
      type: created.type as TransactionType,
      amount: created.amount,
      createdAt: created.createdAt,
    });
  }

  async findAll(filter?: TransactionFilter): Promise<Transaction[]> {
    const where: { type?: TransactionType; userId?: string } = {};

    if (filter?.type) {
      where.type = filter.type;
    }

    if (filter?.userId) {
      where.userId = filter.userId;
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map(
      (t) =>
        new Transaction({
          id: t.id,
          userId: t.userId,
          type: t.type as TransactionType,
          amount: t.amount,
          createdAt: t.createdAt,
        }),
    );
  }

  async getBalance(userId: string): Promise<BalanceResult> {
    const result = await prisma.$queryRaw<{ amount: bigint }[]>`
      SELECT
        COALESCE(
          SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END),
          0
        ) as amount
      FROM transactions
      WHERE user_id = ${userId}
    `;

    return {
      amount: Number(result[0]?.amount ?? 0),
    };
  }
}
