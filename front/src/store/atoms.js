import { atom, selector } from 'recoil';

export const loginState = atom({
  key: 'loginState', // unique ID
  default: false, // 기본값, 초기상태
});

export const lyricsState = atom({
  key: 'lyricsState',
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
  default: JSON.parse(localStorage.getItem('user') || '{}'),
});

// 빈 앨범아트
const initialAlbums = [
  { id: 1, image: null },
  { id: 2, image: null },
  { id: 3, image: null },
  { id: 4, image: null },
  { id: 5, image: null },
];

export const albumsState = atom({
  key: 'albumsState',
  default: initialAlbums,
});

export const commentsState = atom({
  key: 'commentsState',
  default: [
    '비오는 날 듣기 좋은 노래',
    '코딩할 때 듣는 노래',
    '기분 좋아지는 아침',
    '러닝 운동할 때 듣는 노래',
    '센치한 가을 감성',
    '조용한 새벽에 듣는 노래',
    '휴식 시간에 듣는 노래',
    '파티에서 듣는 신나는 노래',
    '집중할 때 듣는 노래',
    '여행 중에 듣는 노래',
    '밤에 듣기 좋은 노래',
    '커피 한 잔과 함께 듣는 노래',
    '산책할 때 듣는 노래',
    '독서할 때 듣는 노래',
    '아침 운동할 때 듣는 노래',
    '명상할 때 듣는 노래',
    '기분 전환할 때 듣는 노래',
    '친구들과 함께 듣는 노래',
    '혼자 있을 때 듣는 노래',
    '저녁 식사 시간에 듣는 노래',
    '기분이 우울할 때 듣는 노래',
    '기분이 좋을 때 듣는 노래',
    '새로운 시작을 위한 노래',
    '추억을 떠올리게 하는 노래',
    '사랑에 빠졌을 때 듣는 노래',
    '이별 후에 듣는 노래',
    '휴가 중에 듣는 노래',
    '일할 때 듣는 노래',
    '운전할 때 듣는 노래',
    '편안한 밤을 위한 노래'
  ],
});

export const albumCommentsSelector = selector({
  key: 'albumCommentsSelector',
  get: ({get}) => {
    const albums = get(albumsState);
    const comments = get(commentsState);
    const shuffledComments = [...comments].sort(() => 0.5 - Math.random());
    
    return albums.map((album, index) => ({
      ...album,
      comment: shuffledComments[index % shuffledComments.length],
    }));
  },
});