import express from 'express';
import passport from 'passport';
import { oauthCallback } from '../controllers/authController.js';

const router = express.Router();

router.get(
  '/auth/spotify',
  passport.authenticate('spotify', {
    scope: ['user-read-email', 'user-read-private', 'streaming'],
  }),
);

router.get('/auth/spotify/callback', passport.authenticate('spotify', { session: true }), oauthCallback);

export default router;
