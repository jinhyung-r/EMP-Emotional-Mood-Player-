import { checkAndRefreshTokenIfNeeded } from '../services/authService.js';
import logger from '../utils/logger.js';
import { AppError, COMMON_ERROR } from '../utils/errors.js';

export const checkAndRefreshToken = async (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    try {
      const tokenRefreshed = await checkAndRefreshTokenIfNeeded(req.user);
      if (tokenRefreshed) {
        req.session.user = req.user;
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              logger.error('세션 저장 중 오류 발생:', { stack: err.stack, cause: err.cause });
              reject(new AppError(COMMON_ERROR.DATABASE_ERROR.name, '세션 저장 중 오류가 발생했습니다.', { cause: err, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode }));
            } else {
              resolve();
            }
          });
        });
      }
      next();
    } catch (error) {
      logger.error(`토큰 refresh 에러: ${error.message}`, { stack: error.stack, cause: error.cause });
      if (error.name === COMMON_ERROR.AUTHORIZATION_ERROR.name) {
        req.logout((err) => {
          if (err) {
            logger.error(`로그아웃 에러: ${err.message}`, { stack: err.stack, cause: err.cause });
          }
          next(new AppError(COMMON_ERROR.AUTHORIZATION_ERROR.name, '인증에 실패했습니다. 다시 로그인해주세요.', { cause: error, statusCode: COMMON_ERROR.AUTHORIZATION_ERROR.statusCode }));
        });
      } else {
        next(new AppError(COMMON_ERROR.BUSINESS_LOGIC_ERROR.name, '토큰 갱신 중 오류가 발생했습니다.', { cause: error, statusCode: COMMON_ERROR.BUSINESS_LOGIC_ERROR.statusCode }));
      }
    }
  } else {
    next(new AppError(COMMON_ERROR.AUTHORIZATION_ERROR.name, '인증이 필요합니다.', { statusCode: COMMON_ERROR.AUTHORIZATION_ERROR.statusCode }));
  }
};
