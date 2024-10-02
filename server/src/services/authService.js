import { isTokenExpired } from '../utils/tokenUtils.js';
import { refreshAccessToken } from './tokenService.js';
import logger from '../utils/logger.js';
import { AppError, COMMON_ERROR } from '../utils/errors.js';

export const checkAndRefreshTokenIfNeeded = async (user) => {
  if (!user || !user.expiresAt) {
    throw new AppError(COMMON_ERROR.AUTHORIZATION_ERROR.name, '다시 로그인해주세요.', { statusCode: COMMON_ERROR.AUTHORIZATION_ERROR.statusCode });
  }

  try {
    if (isTokenExpired(user.expiresAt)) {
      logger.warn(`토큰 만료 user: ${user.id}`);
      const { accessToken, refreshToken, expiresAt } = await refreshAccessToken(user.refreshToken, user.provider);
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.expiresAt = expiresAt;
      logger.info(`해당 user의 토큰이 refresh되었습니다: ${user.id}`);
      return true;
    }
  } catch (error) {
    logger.error(`토큰 refresh 에러입니다: ${error.message}`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(COMMON_ERROR.BUSINESS_LOGIC_ERROR.name, '토큰 갱신 중 오류가 발생했습니다. 다시 로그인해주세요.', { statusCode: COMMON_ERROR.BUSINESS_LOGIC_ERROR.statusCode, cause: error });
  }

  return false;
};
