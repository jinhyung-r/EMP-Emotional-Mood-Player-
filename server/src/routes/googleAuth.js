import express from 'express';
import passport from 'passport';
import { oauthCallback } from '../controllers/authController.js';

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { 
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  oauthCallback
);

export default router;