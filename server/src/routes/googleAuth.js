import express from 'express';
import passport from 'passport';
import { oauthCallback } from '../controllers/authController.js';


const router = express.Router();

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'user-read-playback-state', 'user-modify-playback-state', 'streaming'],
    accessType: 'offline',
  }),
);

router.get('/auth/google/callback', passport.authenticate('google', { session: false }), oauthCallback);

export default router;
