import { Router } from 'express';
import { UserController, AuthController } from '../controllers';
import { authMiddleware } from '../middlewares';

export function createUserRoutes(
  userController: UserController,
  authController: AuthController,
): Router {
  const router = Router();

  // Public routes
  router.post('/auth', (req, res, next) => authController.login(req, res, next));

  // Protected routes
  router.post('/users', authMiddleware, (req, res, next) => userController.create(req, res, next));
  router.get('/users', authMiddleware, (req, res, next) => userController.list(req, res, next));
  router.get('/users/:id', authMiddleware, (req, res, next) => userController.get(req, res, next));
  router.put('/users/:id', authMiddleware, (req, res, next) => userController.update(req, res, next));
  router.delete('/users/:id', authMiddleware, (req, res, next) => userController.delete(req, res, next));

  return router;
}
