import prisma from '../models/index.js';
import logger from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';

export const getUserPlaylists = async (userId) => {
    try {
        const playlists = await prisma.playlist.findMany({
            where: { userId: userId},
            include: {
                tracks: true,
            },
        });
        if (!playlists) {
            throw new NotFoundError('플레이리스트를 찾을 수 없습니다.');
        }

        return playlists;
    } catch (error) {
        logger.error(`플레이리스트 조회 중 오류: ${error.message}`);
        throw error;
    }
};

export const getUserFirstPlaylist = async (userId) => {
    try {
      const playlist = await prisma.playlist.findFirst({
        where: { userId: userId },
        include: {
          tracks: false,
        },
      });
  
      if (!playlist) {
        throw new NotFoundError('플레이리스트를 찾을 수 없습니다.');
      }
  
      return playlist;
    } catch (error) {
      logger.error(`첫 번째 플레이리스트 조회 중 오류 발생: ${error.message}`);
      throw error;
    }
  };