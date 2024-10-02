import express from 'express';
import { getPlaylistByIdHandler } from '../controllers/playlistController.js';
import { updatePlaylistTitleHandler } from '../controllers/playlistController.js';
import { deletePlaylistHandler } from '../controllers/playlistController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.get('/myplaylist/:playlistId', isAuthenticated, getPlaylistByIdHandler);
router.put('/myplaylist/:playlistId', isAuthenticated, updatePlaylistTitleHandler);
router.delete('/myplaylist/:playlistId',isAuthenticated, deletePlaylistHandler);

export default router;
