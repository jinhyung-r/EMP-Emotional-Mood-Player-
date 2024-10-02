import prisma from '../models/index.js';
import logger from '../utils/logger.js';
import { AppError, COMMON_ERROR } from '../utils/errors.js';

export const getUserFirstPlaylist = async (userId) => {
  try {
    const playlist = await prisma.playlist.findFirst({
      where: { userId: userId },
      select: {
        playlistId: true,
      },
    });

    return playlist ? playlist.playlistId : null;
  } catch (error) {
    logger.error(`첫 번째 플레이리스트 조회 중 오류 발생: ${error.message}`);
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, '첫 번째 플레이리스트 조회 중 문제가 발생하였습니다', { cause: error, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode });
  }
};

export const getPlaylistById = async (playlistId) => {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { playlistId: parseInt(playlistId, 10) },
      include: {
        tracks: true,
      },
    });
    if (!playlist) {
      throw new AppError(COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.name, `플레이리스트 ID ${playlistId}를 찾을 수 없습니다`, { statusCode: COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.statusCode });
    }
    return playlist;
  } catch (error) {
    logger.error(`플레이리스트 조회 중 오류: ${error.message}`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB에서 플레이리스트 조회 중 문제가 발생하였습니다', { cause: error, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode });
  }
};

export const updatePlaylistTitle = async (playlistId, newTitle) => {
  try {
    const result = await prisma.playlist.updateMany({
      where: { playlistId: parseInt(playlistId, 10) },
      data: { title: newTitle },
    });

    if (result.count === 0) {
      throw new AppError(COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.name, `플레이리스트 ID ${playlistId}를 찾을 수 없습니다`, { statusCode: COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.statusCode });
    }

    return result;
  } catch (error) {
    logger.error(`플레이리스트 제목 수정 중 오류: ${error.message}`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB에서 플레이리스트 제목 수정 중 문제가 발생하였습니다', { cause: error, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode });
  }
};

export const deletePlaylistById = async (playlistId) => {
  try {
    const result = await prisma.playlist.deleteMany({
      where: { playlistId: parseInt(playlistId, 10) },
    });

    if (result.count === 0) {
      throw new AppError(COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.name, `플레이리스트 ID ${playlistId}를 찾을 수 없습니다`, { statusCode: COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.statusCode });
    }
  } catch (error) {
    logger.error(`플레이리스트 삭제 중 오류: ${error.message}`);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB에서 플레이리스트 삭제 중 문제가 발생하였습니다', { cause: error, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode });
  }
};
