import { ValidationUtils } from '@/shared/utils/validator';
import {
  EmotionPlaylistRequest,
  LyricsPlaylistRequest,
  UpdatePlaylistTitleRequest,
} from '@/playlists/types/playlist.types';
import { DTOValidator } from '@/middlewares/validators/dto.validator';

export const validateEmotionPlaylist = DTOValidator.validate<EmotionPlaylistRequest>({
  genres: [
    {
      validate: (value): value is string =>
        typeof value === 'string' &&
        [
          'ballad',
          'dance',
          'folk',
          'idol',
          'indie',
          'jazz',
          'rnh',
          'rns',
          'rock',
          'adultkpop',
        ].includes(value),
      message: '올바른 장르를 선택해주세요.',
    },
  ],
  song_types: [
    {
      validate: (value): value is string[] =>
        Array.isArray(value) &&
        value.every((type) => ['사랑', '슬픔', '설레임', '이별', '초조함'].includes(type)),
      message: '올바른 곡 타입을 선택해주세요.',
    },
  ],
  prefer_latest: [
    {
      validate: (value): value is boolean => typeof value === 'boolean',
      message: '최신곡 선호 여부를 지정해주세요.',
    },
  ],
});

export const validateLyricsPlaylist = DTOValidator.validate<LyricsPlaylistRequest>({
  searchTerm: [
    {
      validate: (value): value is string =>
        typeof value === 'string' && ValidationUtils.isNotEmpty(value),
      message: '검색어를 입력해주세요.',
    },
    {
      validate: (value) => typeof value === 'string' && ValidationUtils.isLength(value, 1, 100),
      message: '검색어는 1-100자 사이여야 합니다.',
    },
  ],
  prefer_latest: [
    {
      validate: (value): value is boolean => typeof value === 'boolean',
      message: '최신곡 선호 여부를 지정해주세요.',
    },
  ],
});

// 제목용
export const validateUpdatePlaylistTitle = DTOValidator.validate<UpdatePlaylistTitleRequest>({
  newTitle: [
    {
      validate: (value): value is string =>
        typeof value === 'string' && ValidationUtils.isNotEmpty(value),
      message: '플레이리스트 제목은 필수입니다.',
    },
    {
      validate: (value) => typeof value === 'string' && ValidationUtils.isLength(value, 1, 100),
      message: '플레이리스트 제목은 1-100자 사이여야 합니다.',
    },
  ],
});

// 나중에 추가할 플레이리스트 각각 업데이트 하는 용
export const validateUpdatePlaylist = DTOValidator.validate<UpdatePlaylistDTO>({
  title: [
    {
      validate: (value) =>
        !value || (ValidationUtils.isString(value) && ValidationUtils.isLength(value, 1, 100)),
      message: '플레이리스트 제목은 1-100자 사이여야 합니다.',
    },
  ],
  tracks: [
    {
      validate: (value) => {
        if (!value) return true;
        if (!ValidationUtils.isArray(value)) return false;
        return value.every((track) => {
          const validation = DTOValidator['validateObject'](track, trackValidator);
          return validation.isValid;
        });
      },
      message: '모든 트랙은 유효한 형식이어야 합니다.',
    },
  ],
});
