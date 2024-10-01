import express from 'express';
import googleAuthRoutes from './googleAuth.js';
import spotifyAuthRoutes from './spotifyAuth.js';
import { getSpotifyToken, refreshSpotifyToken } from '../controllers/authController.js';


const router = express.Router();

router.use(googleAuthRoutes);
router.use(spotifyAuthRoutes);

router.get('/auth/spotify/token', getSpotifyToken);
router.get('/auth/spotify/refresh-token', refreshSpotifyToken);

export default router;
