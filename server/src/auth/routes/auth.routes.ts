import express from 'express';
import passport from 'passport';
import { authController } from '@auth/controllers/auth.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { RouteConfig } from '@/shared/types/router.types';

const router = express.Router();

// Google OAuth 라우트
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    accessType: 'offline',
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: true }),
  authController.oauthCallback,
);

// Spotify OAuth 라우트
router.get(
  '/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'streaming'],
  }),
);

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', { session: true }),
  authController.oauthCallback,
);

router.get(
  '/spotify/token',
  authMiddleware.isAuthenticated,
  authMiddleware.checkAndRefreshToken,
  authController.getSpotifyToken,
);

router.get('/spotify/refresh-token', authMiddleware.isAuthenticated, authController.refreshToken);

// 로그아웃
router.post('/logout', authMiddleware.isAuthenticated, authController.logout);

export const authRouteConfig: RouteConfig = {
  path: '/auth',
  router,
};
