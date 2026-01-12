import { Request, Response, NextFunction } from 'express';
import { DomainError } from '../../../domain/errors';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof DomainError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);

  return res.status(500).json({ error: 'Internal server error' });
}
