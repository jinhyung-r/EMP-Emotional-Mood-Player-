import { PrismaClient } from '@prisma/client';
import { createLogger } from '@utils/logger';
import { AppError, COMMON_ERROR } from '@utils/errors';
import config from '@/config';

const logger = createLogger(config);

export class PrismaService {
  private static instance: PrismaClient | null = null;
  private static isConnected = false;

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

      // Prisma Events 타입 지정
      const prisma = PrismaService.instance;

      // @ts-expect-error - Prisma Client Extensions API의 한계로 인한 타입 에러 무시
      prisma.$on('query', (event) => {
        logger.debug('Prisma Query:', {
          query: event.query,
          params: event.params,
          duration: event.duration,
        });
      });

      // @ts-expect-error - Prisma Client Extensions API의 한계로 인한 타입 에러 무시
      prisma.$on('error', (event) => {
        logger.error('Prisma Error:', event);
      });

      // @ts-expect-error - Prisma Client Extensions API의 한계로 인한 타입 에러 무시
      prisma.$on('info', (event) => {
        logger.info('Prisma Info:', event);
      });

      // @ts-expect-error - Prisma Client Extensions API의 한계로 인한 타입 에러 무시
      prisma.$on('warn', (event) => {
        logger.warn('Prisma Warning:', event);
      });
    }

    return PrismaService.instance;
  }

  public static async connect(): Promise<void> {
    if (this.isConnected) return;

    try {
      const prisma = this.getInstance();
      await prisma.$connect();
      this.isConnected = true;
      logger.info('Database connected successfully');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      logger.error('Database connection failed:', err);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Database connection failed', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: err,
      });
    }
  }

  public static async disconnect(): Promise<void> {
    if (!this.instance) return;

    try {
      await this.instance.$disconnect();
      this.instance = null;
      this.isConnected = false;
      logger.info('Database disconnected successfully');
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      logger.error('Database disconnection failed:', err);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Database disconnection failed', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: err,
      });
    }
  }
}

export const prisma = PrismaService.getInstance();
