import { getPlaylistById } from '../services/playlistService.js';
import logger from '../utils/logger.js';

export const getPlaylistByIdHandler = async (req, res, next) => {
  const { playlistId } = req.params;
  try {
    const playlist = await getPlaylistById(parseInt(playlistId, 10)); 
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다.' });
    }
    res.json({ playlist });
  } catch (error) {
    logger.error(`플레이리스트 조회 중 오류: ${error.message}`);
    next(error);
  }
};
