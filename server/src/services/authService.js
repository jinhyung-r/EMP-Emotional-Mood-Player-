import { isTokenExpired } from '../utils/tokenUtils.js';
import { refreshAccessToken } from './tokenService.js';
import logger from '../utils/logger.js';

export const checkAndRefreshTokenIfNeeded = async (user) => {
  if (user && user.expiresAt && isTokenExpired(user.expiresAt)) {
    try {
      const { accessToken, refreshToken, expiresAt } = await refreshAccessToken(user);
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.expiresAt = expiresAt;
      await user.save();
      logger.info(`유저 토큰 리프레시 완료: ${user.id}`);
      return true;
    } catch (error) {
      logger.error(`유저 토큰 리프레시 에러: ${error.message}`);
      throw error;
    }
  }
  return false;
};