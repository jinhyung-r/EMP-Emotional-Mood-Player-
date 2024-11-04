import { PrismaClient, Prisma } from '@prisma/client';
import { createLogger } from '@utils/logger';
import { AppError, COMMON_ERROR } from '@utils/errors';
import config from '@/config';

const logger = createLogger(config);

type PrismaEventType = {
  query: Prisma.QueryEvent;
  error: Prisma.LogEvent;
  info: Prisma.LogEvent;
  warn: Prisma.LogEvent;
};

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

      this.setupLogging();
    }

    return PrismaService.instance;
  }

  private static setupLogging(): void {
    if (!PrismaService.instance) return;

    const prisma = PrismaService.instance;

    // Prisma의 타입 시스템 제한으로 인해 any 타입 사용
    (prisma as any).$on('query', (event: PrismaEventType['query']) => {
      logger.debug('Prisma Query:', {
        query: event.query,
        params: event.params,
        duration: event.duration,
        timestamp: event.timestamp,
      });
    });

    (prisma as any).$on('error', (event: PrismaEventType['error']) => {
      logger.error('Prisma Error:', {
        message: event.message,
        timestamp: event.timestamp,
        target: event.target,
      });
    });

    (prisma as any).$on('info', (event: PrismaEventType['info']) => {
      logger.info('Prisma Info:', {
        message: event.message,
        timestamp: event.timestamp,
      });
    });

    (prisma as any).$on('warn', (event: PrismaEventType['warn']) => {
      logger.warn('Prisma Warning:', {
        message: event.message,
        timestamp: event.timestamp,
      });
    });
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
