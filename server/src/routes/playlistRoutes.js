import express from 'express';
import { getPlaylistByIdHandler } from '../controllers/playlistController.js';

const router = express.Router();

router.get('/myplaylist/:playlistId', getPlaylistByIdHandler);

export default router;
