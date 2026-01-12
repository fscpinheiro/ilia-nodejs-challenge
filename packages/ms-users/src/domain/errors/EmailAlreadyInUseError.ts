import { DomainError } from './DomainError';

export class EmailAlreadyInUseError extends DomainError {
  readonly statusCode = 409;

  constructor() {
    super('Email already in use');
  }
}
