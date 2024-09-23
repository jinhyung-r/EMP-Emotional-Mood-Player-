import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import config from '../config/index.js';

// 환경별 다른 에러처리 
export const errorHandler = (err, req, res, _next) => {
  err.statusCode = err.statusCode || 500;

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
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  // 여기는 클라에 넘기는 오류
  if (err instanceof AppError) {
    logger.error(`${err.name}: ${err.message}`);
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  } 

  // 벡엔드 내부 오류, 클라에 전달하지 않음
  else {
    // 정의하지 않은 에러로 로거에 전달
    logger.error('정의하지 않은 에러', { error: err });

    // 메세지 전달(500)
    res.status(500).json({
      status: 'error',
      message: '예기치 않은 에러입니다.'
    });
  }
};