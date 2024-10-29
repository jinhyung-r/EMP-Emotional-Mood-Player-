import { prisma } from '@/infrastructure/database/prisma';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { createLogger } from '@utils/logger';
import { Playlist } from '@prisma/client';
import {
  PlaylistResponse,
  SavedPlaylist,
  UpdatePlaylistTitleRequest,
} from '../types/playlist.types';
import config from '@/config';

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

  public async createPlaylist(data: PlaylistResponse): Promise<SavedPlaylist> {
    try {
      const playlist = await prisma.playlist.create({
        data: {
          title: data.title,
          userId: data.userId,
          tracks: {
            create: data.tracks,
          },
        },
        include: {
          tracks: true,
        },
      });

      this.logger.info(`플레이리스트 생성 완료: ${playlist.playlistId}`);
      return playlist;
    } catch (error) {
      this.logger.error('플레이리스트 생성 중 오류:', error);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '플레이리스트 생성 중 오류가 발생했습니다',
        {
          statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
          cause: error instanceof Error ? error : undefined,
        },
      );
    }
  }

  public async findById(playlistId: number): Promise<Playlist> {
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

      this.logger.error('플레이리스트 조회 중 오류:', error);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB 조회 중 오류가 발생했습니다', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  public async findByUserId(userId: number): Promise<Playlist[]> {
    try {
      const playlists = await prisma.playlist.findMany({
        where: { userId },
        include: { tracks: true },
        orderBy: { createdAt: 'desc' },
      });

      return playlists;
    } catch (error) {
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Failed to fetch user playlists', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  // title update(개별 playlist는 아직임)
  public async updateTitle(
    playlistId: number,
    data: UpdatePlaylistTitleRequest,
  ): Promise<SavedPlaylist> {
    try {
      const playlist = await prisma.playlist.update({
        where: { playlistId },
        data: { title: data.newTitle },
        include: { tracks: true },
      });

      this.logger.info(`플레이리스트 제목 업데이트 완료: ${playlistId} -> "${data.newTitle}"`);
      return playlist;
    } catch (error) {
      this.logger.error(
        `플레이리스트 제목 수정 중 오류: ${error instanceof Error ? error.message : 'Unknown error'}`,
        {
          playlistId,
          newTitle: data.newTitle,
          error,
        },
      );

      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        'DB에서 플레이리스트 제목 수정 중 문제가 발생하였습니다',
        {
          statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
          cause: error instanceof Error ? error : undefined,
        },
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
      this.logger.error('플레이리스트 삭제 중 오류:', error);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '플레이리스트 삭제 중 오류가 발생했습니다',
        {
          statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
          cause: error instanceof Error ? error : undefined,
        },
      );
    }
  }
}

export const playlistService = PlaylistService.getInstance();
