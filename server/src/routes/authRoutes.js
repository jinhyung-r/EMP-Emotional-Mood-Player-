import express from 'express';
import { loginStateHandler } from '../controllers/authController.js';

const router = express.Router();

router.get('/loginState', loginStateHandler);

export default router;
