import { ListTransactions } from './ListTransactions';
import { Transaction, TransactionType } from '../../domain/entities';
import { TransactionRepository } from '../../domain/repositories';

describe('ListTransactions Use Case', () => {
  let listTransactions: ListTransactions;
  let mockTransactionRepository: jest.Mocked<TransactionRepository>;

  beforeEach(() => {
    mockTransactionRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      getBalance: jest.fn(),
    };

    listTransactions = new ListTransactions(mockTransactionRepository);
  });

  it('should list all transactions without filter', async () => {
    const mockTransactions = [
      new Transaction({ id: 'tx-1', userId: 'user-1', type: TransactionType.CREDIT, amount: 1000 }),
      new Transaction({ id: 'tx-2', userId: 'user-1', type: TransactionType.DEBIT, amount: 500 }),
    ];

    mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

    const result = await listTransactions.execute({});

    expect(mockTransactionRepository.findAll).toHaveBeenCalledWith({});
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('tx-1');
    expect(result[1].id).toBe('tx-2');
  });

  it('should list transactions filtered by type', async () => {
    const mockTransactions = [
      new Transaction({ id: 'tx-1', userId: 'user-1', type: TransactionType.CREDIT, amount: 1000 }),
    ];

    mockTransactionRepository.findAll.mockResolvedValue(mockTransactions);

    const result = await listTransactions.execute({ type: TransactionType.CREDIT });

    expect(mockTransactionRepository.findAll).toHaveBeenCalledWith({
      type: TransactionType.CREDIT,
    });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(TransactionType.CREDIT);
  });

  it('should return empty array when no transactions', async () => {
    mockTransactionRepository.findAll.mockResolvedValue([]);

    const result = await listTransactions.execute({});

    expect(result).toHaveLength(0);
  });
});
