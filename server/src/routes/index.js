import express from 'express';
import googleAuthRoutes from './googleAuth.js';
import spotifyAuthRoutes from './spotifyAuth.js';

const router = express.Router();

router.use(googleAuthRoutes);
router.use(spotifyAuthRoutes);

export default router;
