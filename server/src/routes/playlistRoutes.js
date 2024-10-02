import express from 'express';
import { getPlaylistByIdHandler, updatePlaylistTitleHandler, deletePlaylistHandler, createPlaylist, savePlaylist  } from '../controllers/playlistController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();


router.get('/create-playlist', isAuthenticated, createPlaylist);
router.get('/save-playlist', isAuthenticated, savePlaylist);
router.get('/myplaylist/:playlistId', isAuthenticated, getPlaylistByIdHandler);
router.put('/myplaylist/:playlistId', isAuthenticated, updatePlaylistTitleHandler);
router.delete('/myplaylist/:playlistId',isAuthenticated, deletePlaylistHandler);

export default router;
