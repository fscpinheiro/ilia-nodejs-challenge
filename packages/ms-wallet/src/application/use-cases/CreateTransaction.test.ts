import { CreateTransaction } from './CreateTransaction';
import { Transaction, TransactionType } from '../../domain/entities';
import { TransactionRepository } from '../../domain/repositories';
import { UserClient } from '../../infrastructure/grpc';

describe('CreateTransaction Use Case', () => {
  let createTransaction: CreateTransaction;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;
  let mockUserClient: jest.Mocked<UserClient>;

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      getBalance: jest.fn(),
    };

    mockUserClient = {
      validateUser: jest.fn(),
    };

    createTransaction = new CreateTransaction(mockTransactionRepository, mockUserClient);
  });

  it('should create a transaction when user exists', async () => {
    mockUserClient.validateUser.mockResolvedValue(true);
    mockTransactionRepository.create.mockImplementation(async (transaction) => {
      return new Transaction({
        id: 'tx-123',
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        createdAt: new Date('2026-01-12'),
      });
    });

    const result = await createTransaction.execute({
      userId: 'user-123',
      type: TransactionType.CREDIT,
      amount: 1000,
    });

    expect(mockUserClient.validateUser).toHaveBeenCalledWith('user-123');
    expect(mockTransactionRepository.create).toHaveBeenCalled();
    expect(result.id).toBe('tx-123');
    expect(result.user_id).toBe('user-123');
    expect(result.type).toBe(TransactionType.CREDIT);
    expect(result.amount).toBe(1000);
  });

  it('should throw error when user does not exist', async () => {
    mockUserClient.validateUser.mockResolvedValue(false);

    await expect(
      createTransaction.execute({
        userId: 'invalid-user',
        type: TransactionType.CREDIT,
        amount: 1000,
      }),
    ).rejects.toThrow('User not found');

    expect(mockUserClient.validateUser).toHaveBeenCalledWith('invalid-user');
    expect(mockTransactionRepository.create).not.toHaveBeenCalled();
  });
});
