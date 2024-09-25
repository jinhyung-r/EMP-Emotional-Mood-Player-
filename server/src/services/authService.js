import { isTokenExpired, isTokenExpiringSoon } from '../utils/tokenUtils.js';
import { refreshAccessToken } from './tokenService.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';

export const checkAndRefreshTokenIfNeeded = async (user) => {
  if (!user || !user.expiresAt) {
    throw new UnauthorizedError('유저 정보나 토큰정보가 유효하지 않습니다');
  }

  try {
    if (isTokenExpired(user.expiresAt)) {
      logger.warn(`토큰 만료 user: ${user.id}`);
      throw new UnauthorizedError('토큰이 만료되었습니다', '다시 로그인 해주세용용.');
    }

    if (isTokenExpiringSoon(user.expiresAt)) {
      const { accessToken, refreshToken, expiresAt } = await refreshAccessToken(user);
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.expiresAt = expiresAt;
      logger.info(`해당 user의 토큰이 refresh되었답니다: ${user.id}`);
      return true;
    }
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    logger.error(`토큰 refresh 에러입니다: ${error.message}`);
    throw new InternalServerError('토큰 refresh 실패', error.message);
  }

  return false;
};
