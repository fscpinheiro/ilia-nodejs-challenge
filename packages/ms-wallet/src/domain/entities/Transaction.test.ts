import { Transaction, TransactionType } from './Transaction';

describe('Transaction Entity', () => {
  it('should create a valid transaction', () => {
    const transaction = new Transaction({
      userId: 'user-123',
      type: TransactionType.CREDIT,
      amount: 1000,
    });

    expect(transaction.userId).toBe('user-123');
    expect(transaction.type).toBe(TransactionType.CREDIT);
    expect(transaction.amount).toBe(1000);
    expect(transaction.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error when userId is empty', () => {
    expect(() => {
      new Transaction({
        userId: '',
        type: TransactionType.CREDIT,
        amount: 1000,
      });
    }).toThrow('User ID is required');
  });

  it('should throw error when userId is whitespace', () => {
    expect(() => {
      new Transaction({
        userId: '   ',
        type: TransactionType.CREDIT,
        amount: 1000,
      });
    }).toThrow('User ID is required');
  });

  it('should throw error when amount is zero', () => {
    expect(() => {
      new Transaction({
        userId: 'user-123',
        type: TransactionType.CREDIT,
        amount: 0,
      });
    }).toThrow('Amount must be greater than zero');
  });

  it('should throw error when amount is negative', () => {
    expect(() => {
      new Transaction({
        userId: 'user-123',
        type: TransactionType.DEBIT,
        amount: -100,
      });
    }).toThrow('Amount must be greater than zero');
  });

  it('should return correct JSON format', () => {
    const transaction = new Transaction({
      id: 'tx-123',
      userId: 'user-123',
      type: TransactionType.DEBIT,
      amount: 500,
    });

    const json = transaction.toJSON();

    expect(json.id).toBe('tx-123');
    expect(json.user_id).toBe('user-123');
    expect(json.type).toBe('DEBIT');
    expect(json.amount).toBe(500);
    expect(json.created_at).toBeInstanceOf(Date);
  });
});
