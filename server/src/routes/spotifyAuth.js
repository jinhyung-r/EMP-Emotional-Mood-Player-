import express from 'express';
import passport from 'passport';
import { oauthCallback } from '../controllers/authController.js';
import config from '../config/index.js';

const router = express.Router();

router.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private'],
  }),
);

router.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: `${config.FRONTEND_URL}/login` }), oauthCallback);

export default router;
