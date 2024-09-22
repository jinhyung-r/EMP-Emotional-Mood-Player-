import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'SequelizeValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'SequelizeUniqueConstraintError') error = handleDuplicateFieldsDB(error);
    if (error.name === 'SequelizeDatabaseError') error = handleDatabaseErrorDB(error);

    sendErrorProd(error, res);
  }
};

const sendErrorDev = (err, res) => {
  logger.error(`Error: ${err.message}`, { stack: err.stack });
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    logger.error(`Unexpected error: ${err.message}`, { stack: err.stack });
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }
};

const handleValidationErrorDB = err => {
  const errors = err.errors.map(e => e.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const field = err.errors[0].path;
  const message = `Duplicate field value: ${field}. Please use another value!`;
  return new AppError(message, 400);
};

const handleDatabaseErrorDB = err => {
  const message = `Database error: ${err.parent.sqlMessage}`;
  return new AppError(message, 500);
};