import { isTokenExpired } from '../utils/tokenUtils.js';
import { refreshAccessToken } from './tokenService.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';

export const checkAndRefreshTokenIfNeeded = async (user) => {
  if (!user || !user.expiresAt) {
    throw new UnauthorizedError('유저 정보나 토큰정보가 유효하지 않습니다', '다시 로그인해주세요.');
  }

  // 내맘대로 오류 메세지 제거
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
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError('인증에 실패했습니다', '다시 로그인해주세요.');
    }
    logger.error(`토큰 refresh 에러입니다: ${error.message}`);
    throw new InternalServerError('토큰 refresh 실패', '다시 로그인해주세요.');
  }

  return false;
};


export const checkLoginState = async (user) => {
  if (!user) {
    throw new UnauthorizedError('로그인 상태가 아닙니다.');
  }
  return true;
};
