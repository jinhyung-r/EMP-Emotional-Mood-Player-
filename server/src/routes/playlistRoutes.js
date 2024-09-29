import express from 'express';
import { getPlaylistByIdHandler } from '../controllers/playlistController.js';
import { updatePlaylistTitleHandler } from '../controllers/playlistController.js';
import { deletePlaylistHandler } from '../controllers/playlistController.js';

const router = express.Router();

router.get('/myplaylist/:playlistId', getPlaylistByIdHandler);
router.put('/myplaylist/:playlistId', updatePlaylistTitleHandler);
router.delete('/myplaylist/:playlistId', deletePlaylistHandler);

export default router;
