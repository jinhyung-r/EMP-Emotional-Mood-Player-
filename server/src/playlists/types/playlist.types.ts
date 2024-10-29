export interface PlaylistRequestBase {
  userId: number;
  title?: string;
  prefer_latest: boolean;
}

export interface EmotionPlaylistRequest extends PlaylistRequestBase {
  genres: string;
  song_types: string[];
}

export interface LyricsPlaylistRequest extends PlaylistRequestBase {
  searchTerm: string; // 가사 검색어
}

export interface Track {
  title: string;
  artist: string;
  albumArt: string;
  genre: string;
  spotify_id: string;
}

export interface PlaylistResponse {
  title: string;
  userId: number;
  tracks: Track[];
}

export interface SavedPlaylist {
  playlistId: number;
  title: string;
  userId: number;
  tracks: Track[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpdatePlaylistTitleRequest {
  newTitle: string;
}

export interface PlaylistActionResponse {
  success: boolean;
  message?: string;
  playlist?: SavedPlaylist;
}
