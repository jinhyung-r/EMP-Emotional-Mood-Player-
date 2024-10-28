import { PrismaClient } from '@prisma/client';
import { createLogger } from '@/utils/logger';
import config from '@/config';
import { PrismaLogEvent } from '../types/prisma';

const logger = createLogger(config);

class Database {
  private static instance: PrismaClient;

  public static getInstance(): PrismaClient {
    if (!Database.instance) {
      Database.instance = new PrismaClient({
        log: [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'info' },
          { emit: 'event', level: 'warn' },
        ],
      });

      // 타입이 명시된 이벤트 핸들러
      Database.instance.$on('query', (event: PrismaLogEvent) => {
        logger.debug('Query: ' + event.query);
      });

      Database.instance.$on('error', (event: { message: string }) => {
        logger.error('Prisma Error: ' + event.message);
      });

      Database.instance.$on('info', (event: { message: string }) => {
        logger.info('Prisma Info: ' + event.message);
      });

      Database.instance.$on('warn', (event: { message: string }) => {
        logger.warn('Prisma Warning: ' + event.message);
      });
    }

    return Database.instance;
  }

  public static async disconnect(): Promise<void> {
    if (Database.instance) {
      await Database.instance.$disconnect();
    }
  }
}

export const prisma = Database.getInstance();
