import { Playlist, Track as PrismaTrack } from '@prisma/client';

export type Track = PrismaTrack;
export type PlaylistWithTracks = Playlist & { tracks: Track[] };

// AI 모델 응답을 위한 타입
export interface AIModelTrack {
  title: string;
  artist: string;
  albumArt?: string | null;
  genre?: string | null;
  spotifyId: string;
}

export interface AIModelResponse {
  title: string;
  tracks: AIModelTrack[];
}

// 플레이리스트 저장
export interface SavePlaylistRequest {
  title: string;
  userId: number;
  tracks: Omit<Track, 'id' | 'playlistId' | 'createdAt'>[];
}

// 감정/가사 기반 요청 타입
export interface PlaylistRequestBase {
  userId: number;
  prefer_latest: boolean;
}

export interface EmotionPlaylistRequest extends PlaylistRequestBase {
  genres: string;
  song_types: string[];
}

export interface LyricsPlaylistRequest extends PlaylistRequestBase {
  searchTerm: string;
}

export interface UpdatePlaylistTitleRequest {
  newTitle: string;
}

export interface PlaylistActionResponse {
  success: boolean;
  message: string;
  playlist?: PlaylistWithTracks;
  recommendedPlaylist?: AIModelResponse;
}
