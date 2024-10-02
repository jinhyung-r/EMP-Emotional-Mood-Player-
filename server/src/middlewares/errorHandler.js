import logger from '../utils/logger.js';
import config from '../config/index.js';
import { AppError, COMMON_ERROR } from '../utils/errors.js';

export const errorHandler = (err, req, res, _next) => {
  const errorName = err instanceof AppError ? err.name : COMMON_ERROR.UNKNOWN_ERROR.name;
  const errorMessage = err.message || 'An unexpected error occurred';
  const errorStatus = err instanceof AppError ? err.statusCode : COMMON_ERROR.UNKNOWN_ERROR.statusCode;

  logger.error(`${errorName}: ${errorMessage}`, {
    stack: err.stack,
    cause: err.cause?.stack
  });

  const responseBody = {
    status: 'error',
    message: errorMessage
  };

  if (config.NODE_ENV === 'development') {
    responseBody.stack = err.stack;
    responseBody.cause = err.cause?.stack;
  }

  res.status(errorStatus).json(responseBody);
};
