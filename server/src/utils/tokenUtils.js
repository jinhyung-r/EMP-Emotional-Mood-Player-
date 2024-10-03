import { AppError, COMMON_ERROR } from './errors.js';

export const isTokenExpired = (expiresAt) => {
  if (!expiresAt) {
    throw new AppError(COMMON_ERROR.ARGUMENT_ERROR.name, '만료시간(expiresAt)이 유효하지 않습니다.', { statusCode: COMMON_ERROR.ARGUMENT_ERROR.statusCode });
  }
  return Date.now() >= expiresAt;
};
