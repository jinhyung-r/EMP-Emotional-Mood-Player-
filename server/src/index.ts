import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { prisma } from '@/infrastructure/database/prisma';
import { createSessionStore } from '@/infrastructure/session/sessionStore';
import config from '@/config';
import { createLogger } from '@/utils/logger';

const logger = createLogger(config);

async function setupApp() {
  const app = express();

  const corsOptions = {
    origin: config.FRONTEND_URL,
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(config.COOKIE_SECRET));

  // 세션 설정
  const sessionConfig = createSessionStore(config);
  app.use(session(sessionConfig));

  try {
    await prisma.$connect();
    logger.info('데이터베이스 연결 성공');
  } catch (error) {
    if (error instanceof Error) {
      logger.error('데이터베이스 연결 실패:', error);
    }
    process.exit(1);
  }

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received');
    await prisma.$disconnect();
    process.exit(0);
  });

  return app;
}

async function startServer() {
  try {
    const app = await setupApp();
    const port = config.PORT;

    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error('Server startup failed:', error);
    }
    process.exit(1);
  }
}

startServer();
