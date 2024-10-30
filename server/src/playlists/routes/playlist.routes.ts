import express from 'express';
import { playlistController } from '../controllers/playlist.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import { validatePlaylist } from '@/middlewares/validators/playlist.validator';
import { RouteConfig } from '@/shared/types/router.types';

const router = express.Router();

router.post(
  '/recommend/emotion',
  authMiddleware.isAuthenticated,
  validatePlaylist.validateEmotionPlaylist,
  playlistController.createEmotionPlaylist,
);

router.post(
  '/recommend/lyrics',
  authMiddleware.isAuthenticated,
  validatePlaylist.validateLyricsPlaylist,
  playlistController.createLyricsPlaylist,
);

// 플레이리스트 저장
router.post(
  '/save',
  authMiddleware.isAuthenticated,
  validatePlaylist.validateSavePlaylist,
  playlistController.savePlaylist,
);

// 플레이리스트 조회
router.get(
  '/:playlistId',
  authMiddleware.isAuthenticated,
  authMiddleware.checkPermission('playlist'),
  playlistController.getPlaylistById,
);

// 플레이리스트 제목 수정
router.put(
  '/:playlistId/title',
  authMiddleware.isAuthenticated,
  authMiddleware.checkPermission('playlist'),
  validatePlaylist.validateUpdateTitle,
  playlistController.updatePlaylistTitle,
);

// 플레이리스트 삭제
router.delete(
  '/:playlistId',
  authMiddleware.isAuthenticated,
  authMiddleware.checkPermission('playlist'),
  playlistController.deletePlaylist,
);

export const playlistRoutes: RouteConfig = {
  path: '/playlists',
  router,
};
