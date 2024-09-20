import { checkAndRefreshTokenIfNeeded } from '../services/authService.js';
import logger from '../utils/logger.js';

export const checkAndRefreshToken = async (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    try {
      const tokenRefreshed = await checkAndRefreshTokenIfNeeded(req.user);
      if (tokenRefreshed) {
        req.session.user = req.user;
      }
    } catch (error) {
      logger.error(`토큰 리프레시 에러: ${error.message}`);
      return res.status(401).json({ message: "인증 중 로그인에러, 재로그인해주세요" });
    }
  }
  next();
};