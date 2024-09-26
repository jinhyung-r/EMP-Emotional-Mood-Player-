import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import config from './config/index.js';
import sessionConfig from './config/session.js';
import configurePassport from './config/passport.js';
import routes from './routes/index.js';
import prisma from './models/index.js';
import { checkAndRefreshToken } from './middlewares/tokenMiddlware.js';
import logger from './utils/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';

// log 디렉토리 확인용
import fs from 'fs';
import path from 'path';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 모든 라우트 앞에 이 미들웨어를 추가
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// singed cookie => cookieParser(config 옵션 사용)
app.use(cookieParser(config.COOKIE_SECRET));

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use(checkAndRefreshToken);

app.use('/', routes);

app.use(errorHandler);

app.use((err, req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(500).send('An unexpected error occurred');
});

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
  console.log(`Server is running on port ${config.PORT}`);
});

export default app;
