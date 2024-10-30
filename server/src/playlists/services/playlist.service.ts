import { prisma } from '@/infrastructure/database/prisma.service';
import { AppError, COMMON_ERROR } from '@/shared/utils/errors';
import { createLogger } from '@/shared/utils/logger';
import config from '@/config';
import {
  PlaylistWithTracks,
  SavePlaylistRequest,
  UpdatePlaylistTitleRequest,
} from '../types/playlist.types';

export class PlaylistService {
  private static instance: PlaylistService;
  private readonly logger = createLogger(config);

  private constructor() {}

  public static getInstance(): PlaylistService {
    if (!PlaylistService.instance) {
      PlaylistService.instance = new PlaylistService();
    }
    return PlaylistService.instance;
  }

  public async savePlaylist(data: SavePlaylistRequest): Promise<PlaylistWithTracks> {
    try {
      const playlist = await prisma.playlist.create({
        data: {
          title: data.title,
          userId: data.userId,
          tracks: {
            create: data.tracks.map((track) => ({
              title: track.title,
              artist: track.artist,
              albumArt: track.albumArt,
              genre: track.genre,
              spotifyId: track.spotifyId,
            })),
          },
        },
        include: {
          tracks: true,
        },
      });

      this.logger.info(`새로운 플레이리스트 저장 완료: ${playlist.playlistId}`);
      return playlist;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error('플레이리스트 저장 중 오류:', err);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '플레이리스트 저장 중 오류가 발생했습니다',
        { statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode, cause: err },
      );
    }
  }

  public async findByUserId(userId: number): Promise<PlaylistWithTracks[]> {
    try {
      const playlists = await prisma.playlist.findMany({
        where: { userId },
        include: { tracks: true },
        orderBy: { createdAt: 'desc' },
      });

      return playlists;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error('사용자의 플레이리스트 조회 중 오류:', err);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB 조회 중 오류가 발생했습니다', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: err,
      });
    }
  }

  public async findById(playlistId: number): Promise<PlaylistWithTracks> {
    try {
      const playlist = await prisma.playlist.findUnique({
        where: { playlistId },
        include: { tracks: true },
      });

      if (!playlist) {
        throw new AppError(
          COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.name,
          `ID ${playlistId}에 해당하는 플레이리스트를 찾을 수 없습니다`,
          { statusCode: COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.statusCode },
        );
      }

      return playlist;
    } catch (error) {
      if (error instanceof AppError) throw error;

      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error('플레이리스트 조회 중 오류:', err);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB 조회 중 오류가 발생했습니다', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: err,
      });
    }
  }

  public async updateTitle(
    playlistId: number,
    data: UpdatePlaylistTitleRequest,
  ): Promise<PlaylistWithTracks> {
    try {
      const playlist = await prisma.playlist.update({
        where: { playlistId },
        data: { title: data.newTitle },
        include: { tracks: true },
      });

      this.logger.info(`플레이리스트 제목 업데이트 완료: ${playlistId}`);
      return playlist;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error('플레이리스트 제목 수정 중 오류:', err);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        'DB에서 플레이리스트 제목 수정 중 문제가 발생하였습니다',
        { statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode, cause: err },
      );
    }
  }

  public async delete(playlistId: number): Promise<void> {
    try {
      await prisma.playlist.delete({
        where: { playlistId },
      });

      this.logger.info(`플레이리스트 삭제 완료: ${playlistId}`);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error('플레이리스트 삭제 중 오류:', err);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '플레이리스트 삭제 중 오류가 발생했습니다',
        { statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode, cause: err },
      );
    }
  }
}

export const playlistService = PlaylistService.getInstance();
