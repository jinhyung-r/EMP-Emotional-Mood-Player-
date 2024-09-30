import { BadRequestError } from './errors.js';

export const isTokenExpired = (expiresAt) => {
  if (!expiresAt) {
    throw new BadRequestError('만료시간(expiresAt)이 유효하지 않습니다.');
  }
  return Date.now() >= expiresAt;
};
