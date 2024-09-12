import { atom } from 'recoil';

export const loginState = atom({
  key: 'loginState', // unique ID
  default: false, // 기본값, 초기상태
});

export const lyricsState = atom({
  key: 'lyricsState',
  default: '',
});