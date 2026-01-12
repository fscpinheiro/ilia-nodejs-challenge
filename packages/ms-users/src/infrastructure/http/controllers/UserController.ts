import { Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  CreateUser,
  ListUsers,
  GetUser,
  UpdateUser,
  DeleteUser,
} from '../../../application/use-cases';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AppError } from '../middlewares/errorHandler';

const createUserSchema = z.object({
  first_name: z.string().min(1, 'first_name is required'),
  last_name: z.string().min(1, 'last_name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const updateUserSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
});

export class UserController {
  constructor(
    private createUser: CreateUser,
    private listUsers: ListUsers,
    private getUser: GetUser,
    private updateUser: UpdateUser,
    private deleteUser: DeleteUser,
  ) {}

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const validation = createUserSchema.safeParse(req.body);

      if (!validation.success) {
        throw new AppError(validation.error.errors[0].message, 400);
      }

      const { first_name, last_name, email, password } = validation.data;

      const result = await this.createUser.execute({
        firstName: first_name,
        lastName: last_name,
        email,
        password,
      });

      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already in use') {
        return next(new AppError('Email already in use', 400));
      }
      next(error);
    }
  }

  async list(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await this.listUsers.execute();
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await this.getUser.execute({ id });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return next(new AppError('User not found', 404));
      }
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const validation = updateUserSchema.safeParse(req.body);

      if (!validation.success) {
        throw new AppError(validation.error.errors[0].message, 400);
      }

      const { first_name, last_name, email, password } = validation.data;

      const result = await this.updateUser.execute({
        id,
        firstName: first_name,
        lastName: last_name,
        email,
        password,
      });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return next(new AppError('User not found', 404));
      }
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await this.deleteUser.execute({ id });

      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'User not found') {
        return next(new AppError('User not found', 404));
      }
      next(error);
    }
  }
}
