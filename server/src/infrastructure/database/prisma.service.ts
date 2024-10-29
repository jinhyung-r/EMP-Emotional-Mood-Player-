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

      PrismaService.setupLogging(PrismaService.instance);
    }
    return PrismaService.instance;
  }

  private static setupLogging(prisma: PrismaClient): void {
    prisma.$on('query', (e: { query: string; params: string; duration: number }) => {
      logger.debug('Prisma Query:', {
        query: e.query,
        params: e.params,
        duration: e.duration,
      });
    });

    prisma.$on('error', (e) => {
      logger.error('Prisma Error:', e);
    });

    prisma.$on('info', (e) => {
      logger.info('Prisma Info:', e);
    });

    prisma.$on('warn', (e) => {
      logger.warn('Prisma Warning:', e);
    });
  }

  public static async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }
    try {
      const prisma = this.getInstance();
      await prisma.$connect();
      this.isConnected = true;
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Database connection failed', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  public static async disconnect(): Promise<void> {
    if (!this.instance) {
      return;
    }
    try {
      await this.instance.$disconnect();
      this.instance = null;
      this.isConnected = false;
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection failed:', error);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Database disconnection failed', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: error instanceof Error ? error : undefined,
      });
    }
  }
}
