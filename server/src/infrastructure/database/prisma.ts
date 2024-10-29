import { PrismaClient } from '@prisma/client';
import { createLogger } from '@utils/logger';
import config from '@/config';
import { AppError, COMMON_ERROR } from '@utils/errors';

const logger = createLogger(config);

export class PrismaService {
  private static instance: PrismaClient | null = null;

  private constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'info' },
          { emit: 'event', level: 'warn' },
        ],
      });

      // Prisma 이벤트 로깅 설정
      PrismaService.instance.$on('query', (e) => {
        logger.debug('Prisma Query:', e);
      });

      PrismaService.instance.$on('error', (e) => {
        logger.error('Prisma Error:', e);
      });

      // 연결 테스트
      PrismaService.instance
        .$connect()
        .then(() => {
          logger.info('Database connected successfully');
        })
        .catch((error: Error | undefined) => {
          logger.error('Database connection failed:', error);
          throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Database connection failed', {
            statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
            cause: error instanceof Error ? error : undefined,
          });
        });
    }

    return PrismaService.instance;
  }

  public static async disconnect(): Promise<void> {
    if (PrismaService.instance) {
      await PrismaService.instance.$disconnect();
      PrismaService.instance = null;
    }
  }
}

export const prisma = PrismaService.getInstance();
