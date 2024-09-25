import { checkAndRefreshTokenIfNeeded } from '../services/authService.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';

export const checkAndRefreshToken = async (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    try {
      const tokenRefreshed = await checkAndRefreshTokenIfNeeded(req.user);
      if (tokenRefreshed) {
        req.session.user = req.user;
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) reject(new InternalServerError('세션 저장 중 오류 발생.', err.message));
            else resolve();
          });
        });
      }
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        req.logout((err) => {
          if (err) {
            logger.error(`로그아웃 에러!: ${err.message}`);
          }
          return res.status(error.statusCode).json({ message: error.message, details: error.details });
        });
      } else {
        logger.error(`토큰 refresh 에러!: ${error.message}`);
        return res.status(error.statusCode || 500).json({ message: error.message, details: error.details });
      }
    }
  }
  next();
};
