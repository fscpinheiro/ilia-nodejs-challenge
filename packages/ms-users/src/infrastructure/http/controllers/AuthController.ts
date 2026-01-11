import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { Authenticate } from '../../../application/use-cases';
import { AppError } from '../middlewares/errorHandler';

const authSchema = z.object({
  user: z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export class AuthController {
  constructor(private authenticate: Authenticate) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = authSchema.safeParse(req.body);

      if (!validation.success) {
        throw new AppError(validation.error.errors[0].message, 400);
      }

      const { email, password } = validation.data.user;

      const result = await this.authenticate.execute({ email, password });

      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invalid credentials') {
        return next(new AppError('Invalid credentials', 401));
      }
      next(error);
    }
  }
}
