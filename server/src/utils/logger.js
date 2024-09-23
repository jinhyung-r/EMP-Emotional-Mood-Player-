import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import config from '../config/index.js';

// 환경별 로그 레벨 설정
const getLogLevel = () => {
  switch (config.NODE_ENV) {
    case 'production':
      return 'info';
    default:
      return 'debug';
  }
};

// 포맷이랑 색 설정ㅏ
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// 파일 출력 형식
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// 일반 로그 파일 설정
const fileRotateTransport = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: fileFormat,
});

// 에러 로그 파일 설정
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
  level: getLogLevel(),
  format: fileFormat,
  defaultMeta: { service: 'EMP logs' },
  transports: [
    fileRotateTransport,
    errorFileRotateTransport,
  ],
});

// 개발 환경에서는 콘솔에도 로그 출력
if (config.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat,
  }));
}

export default logger;