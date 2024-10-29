import { AppError } from './errors';
import { COMMON_ERROR } from './errors';

export const isTokenExpired = (expiresAt: number): boolean => {
  if (!expiresAt) {
    throw new AppError(
      COMMON_ERROR.ARGUMENT_ERROR.name,
      '만료시간(expiresAt)이 유효하지 않습니다.',
      { statusCode: COMMON_ERROR.ARGUMENT_ERROR.statusCode },
    );
  }
  return Date.now() >= expiresAt;
};
