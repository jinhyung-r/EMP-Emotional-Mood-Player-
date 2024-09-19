import { isTokenExpired, refreshAccessToken } from '../utils/tokenUtils.js';
import logger from '../utils/logger.js';

export const checkAndRefreshToken = async (req, res, next) => {
  if (req.isAuthenticated() && req.user.expiresAt) {
    if (isTokenExpired(req.user.expiresAt)) {
      try {
        const { accessToken, expiresAt } = await refreshAccessToken(req.user);
        req.user.accessToken = accessToken;
        req.user.expiresAt = expiresAt;
        req.session.user = req.user;
        logger.info(`리프레시 완료 유저: ${req.user.id}`);
      } catch (error) {
        logger.error(`리프레시중 에러: ${error.message}`);
        return res.status(401).json({ message: "로그인 중 에러, 다시 로그인 해주세요." });
      }
    }
  }
  next();
};