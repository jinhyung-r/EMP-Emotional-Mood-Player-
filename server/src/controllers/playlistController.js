import { getPlaylistById } from '../services/playlistService.js';
import logger from '../utils/logger.js';
import { NotFoundError } from '../utils/errors.js';
import { updatePlaylistTitle } from '../services/playlistService.js';

export const getPlaylistByIdHandler = async (req, res, next) => {
  const { playlistId } = req.params;
  try {
    const playlist = await getPlaylistById(parseInt(playlistId, 10));
    if (!playlist) {
      throw new NotFoundError('플레이리스트를 찾을 수 없습니다.');
    }
    res.json({ playlist });
  } catch (error) {
    logger.error(`플레이리스트 조회 중 오류: ${error.message}`);
    next(error);
  }
};

export const updatePlaylistTitleHandler = async (req, res, next) => {
  const { playlistId } = req.params;
  const { newTitle } = req.body;
  try {
    const updatedPlaylist = await updatePlaylistTitle(playlistId, newTitle);
    res.json({ success: true, playlist: updatedPlaylist });
  } catch (error) {
    logger.error(`플레이리스트 제목 수정 중 오류: ${error.message}`);
    next(error);
  }
};
