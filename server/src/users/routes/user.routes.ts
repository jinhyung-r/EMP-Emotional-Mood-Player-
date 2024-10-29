import express from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validateUpdateUser } from '@/middlewares/validators/user.validator';
import { RouteConfig } from '@/shared/types/router.types';

const router = express.Router();

router.get('/info', authMiddleware.isAuthenticated, userController.getUserInfo);

router.put(
  '/profile',
  authMiddleware.isAuthenticated,
  validateUpdateUser,
  userController.updateProfile,
);

export const userRouteConfig: RouteConfig = {
  path: '/users',
  router,
};
