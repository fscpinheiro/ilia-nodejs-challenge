import { DomainError } from './DomainError';

export class InvalidCredentialsError extends DomainError {
  readonly statusCode = 401;

  constructor() {
    super('Invalid credentials');
  }
}
