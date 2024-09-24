import { BadRequestError } from "./errors";

// token expiresAt 사용해서 만료 10분 전부터 갱신 시도
// 상수니까 대문자 + 언더스코어로 명명(JS  컨벤션?)
const REFRESH_THRESHOLD = 10 * 60 * 1000; // 10분

export const isTokenExpiringSoon = (expiresAt) => {
  if (!expiresAt) {
    throw new BadRequestError('만료시간(expiresAt)이 유효하지 않습니다.');
  }
  const now = Date.now();
  return expiresAt - now < REFRESH_THRESHOLD;
};

export const isTokenExpired = (expiresAt) => {
  if (!expiresAt) {
    throw new BadRequestError('만료시간(expiresAt)이 유효하지 않습니다.');
  }
  return Date.now() >= expiresAt;
};