export enum TransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export interface TransactionProps {
  id?: string;
  userId: string;
  type: TransactionType;
  amount: number;
  createdAt?: Date;
}

export class Transaction {
  private readonly props: TransactionProps;

  constructor(props: TransactionProps) {
    this.validate(props);
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  private validate(props: TransactionProps): void {
    if (!props.userId || props.userId.trim() === '') {
      throw new Error('User ID is required');
    }

    if (props.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (!Object.values(TransactionType).includes(props.type)) {
      throw new Error('Invalid transaction type');
    }
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get type(): TransactionType {
    return this.props.type;
  }

  get amount(): number {
    return this.props.amount;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  toJSON() {
    return {
      id: this.id,
      user_id: this.userId,
      type: this.type,
      amount: this.amount,
      created_at: this.createdAt,
    };
  }
}
