import { atom } from 'recoil';

export const loginState = atom({
  key: 'loginState', // unique ID
  default: false, // 기본값, 초기상태
});

export const searchTermState = atom({
  key: 'searchTermState',
  default: '',
});

// 액세스 토큰 상태
export const accessTokenState = atom({
  key: 'accessTokenState',
  default: null,
});

// 리프레시 토큰 상태
export const refreshTokenState = atom({
  key: 'refreshTokenState',
  default: null,
});

// 사용자 정보 관리
export const userState = atom({
  key: 'userState',
  default: null,
});
