import express from 'express';
import { playlistController } from '../controllers/playlist.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';
import {
  validateEmotionPlaylist,
  validateLyricsPlaylist,
  validateUpdatePlaylistTitle,
} from '@/middlewares/validators/playlist.validator';
import { RouteConfig } from '@/shared/types/router.types';

const router = express.Router();

// 감정 기반 플레이리스트 생성
router.post(
  '/emotion',
  authMiddleware.isAuthenticated,
  validateEmotionPlaylist,
  playlistController.createEmotionPlaylist,
);

// 가사 기반 플레이리스트 생성
router.post(
  '/lyrics',
  authMiddleware.isAuthenticated,
  validateLyricsPlaylist,
  playlistController.createLyricsPlaylist,
);

// 플레이리스트 조회
router.get(
  '/:playlistId',
  authMiddleware.isAuthenticated,
  authMiddleware.checkPermission('playlist'),
  playlistController.getPlaylistById,
);

// 플레이리스트 제목 업데이트
router.put(
  '/:playlistId/title',
  authMiddleware.isAuthenticated,
  authMiddleware.checkPermission('playlist'),
  validateUpdatePlaylistTitle,
  playlistController.updatePlaylistTitle,
);

// 플레이리스트 삭제
router.delete(
  '/:playlistId',
  authMiddleware.isAuthenticated,
  authMiddleware.checkPermission('playlist'),
  playlistController.deletePlaylist,
);

// `RouteConfig` 타입을 활용해 라우터와 경로를 명시적으로 설정
export const playlistRoutesConfig: RouteConfig = {
  path: '/playlist',
  router,
};
