import prisma from '../models/index.js';
import logger from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';

export const getUserPlaylists = async (playlistId) => {
    try {
        const playlists = await prisma.playlist.findMany({
            where: { playlistId: parseInt(playlistId, 10) }, 
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
<<<<<<< HEAD
      select: {
        playlistId: true, // playlistId만 선택
=======
      include: {
        tracks: false,
>>>>>>> 18bdf33221dfdf142c1a5cb632ca24152a3346ad
      },
    });

    return playlist ? playlist.playlistId : null; // playlistId가 없으면 null 반환
  } catch (error) {
    logger.error(`첫 번째 플레이리스트 조회 중 오류 발생: ${error.message}`);
    return null; // 에러 발생 시에도 null 반환
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
            throw new NotFoundError('플레이리스트를 찾을 수 없습니다.');
        }

        return playlist;
    } catch (error) {
        logger.error(`플레이리스트 조회 중 오류: ${error.message}`);
        throw error;
    }
};