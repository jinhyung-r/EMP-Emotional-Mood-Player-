export interface Track {
  id: number;
  title: string;
  artist: string;
  albumArt?: string | null;
  genre?: string | null;
  playlistId: number;
  spotify_id?: string | null;
}

export interface Playlist {
  playlistId: number;
  title: string;
  userId: number;
  tracks: Track[];
}

export interface CreatePlaylistDTO {
  title: string;
  userId: number;
  tracks: Omit<Track, 'id' | 'playlistId'>[];
}

export interface UpdatePlaylistDTO {
  title?: string;
  tracks?: Omit<Track, 'playlistId'>[];
}
