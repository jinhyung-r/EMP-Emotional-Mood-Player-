import express from 'express';
import passport from 'passport';
import { oauthCallback, logout } from '../controllers/authController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

const setupAuthRoute = (provider) => {
  router.get(`/auth/${provider}`, passport.authenticate(provider, { 
    scope: provider === 'google' ? ['profile', 'email'] : ['user-read-email', 'user-read-private']
  }));
  router.get(`/auth/${provider}/callback`, 
    passport.authenticate(provider, { failureRedirect: '/login' }),     // 여기도 고민
    oauthCallback
  );
};

setupAuthRoute('google');
setupAuthRoute('spotify');


// 여기도 사용자에 따라 리다렉 로직 구현 필요
router.get('/create', isAuthenticated, (req, res) => {
  res.json({
    user: req.session.user
  });
});

// home or logout?
router.get('/home', logout);

export default router;