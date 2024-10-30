import { ValidationUtils } from '@/shared/utils/validator';
import {
  EmotionPlaylistRequest,
  LyricsPlaylistRequest,
  SavePlaylistRequest,
  UpdatePlaylistTitleRequest,
  Track,
} from '@/playlists/types/playlist.types';
import { DTOValidator } from './dto.validator';

class PlaylistValidator {
  private static instance: PlaylistValidator;

  private constructor() {}

  public static getInstance(): PlaylistValidator {
    if (!PlaylistValidator.instance) {
      PlaylistValidator.instance = new PlaylistValidator();
    }
    return PlaylistValidator.instance;
  }

  public validateEmotionPlaylist = DTOValidator.validate<EmotionPlaylistRequest>({
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
          value.length > 0 &&
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

  public validateLyricsPlaylist = DTOValidator.validate<LyricsPlaylistRequest>({
    searchTerm: [
      {
        validate: (value): value is string =>
          typeof value === 'string' && ValidationUtils.isNotEmpty(value),
        message: '검색어를 입력해주세요.',
      },
      {
        validate: (value): value is string =>
          typeof value === 'string' && ValidationUtils.isLength(value, 1, 100),
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

  public validateSavePlaylist = DTOValidator.validate<SavePlaylistRequest>({
    title: [
      {
        validate: (value): value is string =>
          typeof value === 'string' && ValidationUtils.isNotEmpty(value),
        message: '플레이리스트 제목은 필수입니다.',
      },
      {
        validate: (value): value is string =>
          typeof value === 'string' && ValidationUtils.isLength(value, 1, 100),
        message: '플레이리스트 제목은 1-100자 사이여야 합니다.',
      },
    ],
    tracks: [
      {
        validate: (value): value is Omit<Track, 'id' | 'playlistId' | 'createdAt'>[] => {
          if (!Array.isArray(value) || value.length === 0) return false;
          return value.every(
            (track) =>
              typeof track.title === 'string' &&
              typeof track.artist === 'string' &&
              typeof track.spotifyId === 'string' &&
              (track.albumArt === null || typeof track.albumArt === 'string') &&
              (track.genre === null || typeof track.genre === 'string'),
          );
        },
        message: '트랙 정보가 올바르지 않습니다.',
      },
    ],
  });

  public validateUpdateTitle = DTOValidator.validate<UpdatePlaylistTitleRequest>({
    newTitle: [
      {
        validate: (value): value is string =>
          typeof value === 'string' && ValidationUtils.isNotEmpty(value),
        message: '새로운 제목을 입력해주세요.',
      },
      {
        validate: (value): value is string =>
          typeof value === 'string' && ValidationUtils.isLength(value, 1, 100),
        message: '제목은 1-100자 사이여야 합니다.',
      },
    ],
  });
}

export const validatePlaylist = PlaylistValidator.getInstance();
