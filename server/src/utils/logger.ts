import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { Config } from '@/shared/types/common';

const getLogLevel = (config: Config) => {
  switch (config.NODE_ENV) {
    case 'production':
      return 'info';
    default:
      return 'debug';
  }
};

const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
);

export const createLogger = (config: Config) => {
  const fileRotateTransport = new DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: fileFormat,
  });

  const errorFileRotateTransport = new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',
    format: fileFormat,
  });

  const logger = winston.createLogger({
    level: getLogLevel(config),
    format: fileFormat,
    defaultMeta: { service: 'EMP logs' },
    transports: [fileRotateTransport, errorFileRotateTransport],
  });

  if (config.NODE_ENV !== 'production') {
    logger.add(
      new winston.transports.Console({
        format: consoleFormat,
      }),
    );
  }

  return logger;
};
