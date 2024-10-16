import express from 'express';
import { getUserInfo } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.get('/user-info', isAuthenticated, getUserInfo);

export default router;