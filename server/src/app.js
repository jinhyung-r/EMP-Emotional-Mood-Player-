import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config/index.js';
import sessionConfig from './config/session.js';
import configurePassport from './config/passport.js';
import routes from './routes/index.js';
import { checkAndRefreshToken } from './middlewares/tokenMiddleware.js';
import logger from './utils/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';
import playlistRoutes from './routes/playlistRoutes.js';
import authRoutes from './routes/authRoutes.js';
import prisma from './models/index.js';

// log 디렉토리 확인용
import fs from 'fs';
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// singed cookie => cookieParser(config 옵션 사용)
app.use(cookieParser(config.COOKIE_SECRET));

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

configurePassport();


app.use('/', routes);

app.use('/auth', authRoutes);

app.use(checkAndRefreshToken);
app.use(playlistRoutes);
app.use(authRoutes);

app.use(errorHandler);

app.use((err, req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).send('An unexpected error occurred');
});

app.listen(config.PORT, () => {
  logger.debug(`Server is running on port ${config.PORT}`);
});

export default app;