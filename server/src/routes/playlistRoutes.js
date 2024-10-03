import express from 'express';
import { createLyricsPlaylist, createEmotionPlaylist, getPlaylistByIdHandler, updatePlaylistTitleHandler, deletePlaylistHandler, savePlaylist } from '../controllers/playlistController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();


router.post('/lyrics-playlist', isAuthenticated, createLyricsPlaylist);
router.post('/emotion-playlist', isAuthenticated, createEmotionPlaylist);
router.post('/save-playlist', isAuthenticated, savePlaylist);
router.get('/myplaylist/:playlistId', isAuthenticated, getPlaylistByIdHandler);
router.put('/myplaylist/:playlistId', isAuthenticated, updatePlaylistTitleHandler);
router.delete('/myplaylist/:playlistId',isAuthenticated, deletePlaylistHandler);

export default router;
