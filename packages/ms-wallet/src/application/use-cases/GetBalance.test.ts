import { GetBalance } from './GetBalance';
import { TransactionRepository } from '../../domain/repositories';

describe('GetBalance Use Case', () => {
  let getBalance: GetBalance;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      getBalance: jest.fn(),
    };

    getBalance = new GetBalance(mockTransactionRepository);
  });

  it('should return balance for user', async () => {
    mockTransactionRepository.getBalance.mockResolvedValue({ amount: 5000 });

    const result = await getBalance.execute({ userId: 'user-123' });

    expect(mockTransactionRepository.getBalance).toHaveBeenCalledWith('user-123');
    expect(result.amount).toBe(5000);
  });

  it('should return zero balance for user with no transactions', async () => {
    mockTransactionRepository.getBalance.mockResolvedValue({ amount: 0 });

    const result = await getBalance.execute({ userId: 'new-user' });

    expect(result.amount).toBe(0);
  });

  it('should return negative balance when debits exceed credits', async () => {
    mockTransactionRepository.getBalance.mockResolvedValue({ amount: -2000 });

    const result = await getBalance.execute({ userId: 'user-456' });

    expect(result.amount).toBe(-2000);
  });
});
