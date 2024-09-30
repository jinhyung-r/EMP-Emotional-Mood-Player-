import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import config from '../config/index.js';

export const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode ?? 500;

  if (config.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (config.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};

const sendErrorDev = (err, res) => {
  logger.error(`${err.name}: ${err.message}`, { stack: err.stack });

  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err instanceof AppError) {
    logger.error(`${err.name}: ${err.message}`);
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    logger.error('예기치 못한 오류', { error: err });

    res.status(500).json({
      status: 'error',
      message: '서버 내부 오류가 발생했습니다.',
    });
  }
};
