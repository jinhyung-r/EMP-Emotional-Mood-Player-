import { Request, Response, NextFunction } from 'express';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { createLogger } from '@utils/logger';
import config from '@/config';

const logger = createLogger(config);

export class ErrorMiddleware {
  private static instance: ErrorMiddleware;

  private constructor() {}

  public static getInstance(): ErrorMiddleware {
    if (!ErrorMiddleware.instance) {
      ErrorMiddleware.instance = new ErrorMiddleware();
    }
    return ErrorMiddleware.instance;
  }

  public handleError = (
    err: Error,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
  ): void => {
    const errorName = err instanceof AppError ? err.name : COMMON_ERROR.UNKNOWN_ERROR.name;
    const errorMessage = err.message || '예상치 못한 오류가 발생했습니다';
    const errorStatus =
      err instanceof AppError ? err.statusCode : COMMON_ERROR.UNKNOWN_ERROR.statusCode;

    // 에러 로깅
    logger.error(`${errorName}: ${errorMessage}`, {
      path: req.path,
      method: req.method,
      stack: err.stack,
      cause: err instanceof AppError ? err.cause?.stack : undefined,
    });

    const responseBody = {
      status: 'error',
      message: errorMessage,
      ...(config.NODE_ENV === 'development' && {
        stack: err.stack,
        cause: err instanceof AppError ? err.cause?.stack : undefined,
      }),
    };

    res.status(errorStatus).json(responseBody);
  };

  public notFound = (req: Request, res: Response, next: NextFunction): void => {
    const err = new AppError(
      COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.name,
      `Path ${req.path} not found`,
      { statusCode: COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.statusCode },
    );
    next(err);
  };
}

export const errorMiddleware = ErrorMiddleware.getInstance();
