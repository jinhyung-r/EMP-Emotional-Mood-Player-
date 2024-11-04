import { Response, NextFunction } from 'express';
import axios from 'axios';
import { AuthenticatedRequest } from '@/auth/types/auth.types';
import { AppError, COMMON_ERROR } from '@/shared/utils/errors';
import { playlistService } from '../services/playlist.service';
import config from '@/config';
import {
  EmotionPlaylistRequest,
  LyricsPlaylistRequest,
  AIModelResponse,
  SavePlaylistRequest,
  UpdatePlaylistTitleRequest,
  PlaylistActionResponse,
} from '../types/playlist.types';

export class PlaylistController {
  private static instance: PlaylistController;

  private constructor() {}

  public static getInstance(): PlaylistController {
    if (!PlaylistController.instance) {
      PlaylistController.instance = new PlaylistController();
    }
    return PlaylistController.instance;
  }

  public createEmotionPlaylist = async (
    req: AuthenticatedRequest,
    res: Response<PlaylistActionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistData: EmotionPlaylistRequest = {
        ...req.body,
        userId: req.user!.id,
        prefer_latest: req.body.prefer_latest ?? true,
      };

      const modelResponse = await axios.post<AIModelResponse>(
        `${config.AI_MODEL_URL}/myplaylist`,
        playlistData,
      );

      res.status(200).json({
        success: true,
        message: '감정 기반 플레이리스트가 생성되었습니다.',
        recommendedPlaylist: modelResponse.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        next(
          new AppError(
            COMMON_ERROR.VALIDATION_ERROR.name,
            '감정 분석 입력 데이터가 올바르지 않습니다',
            { statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode, cause: error },
          ),
        );
      } else {
        next(
          new AppError(
            COMMON_ERROR.EXTERNAL_API_ERROR.name,
            'AI 모델 서버 연동 중 오류가 발생했습니다',
            {
              statusCode: COMMON_ERROR.EXTERNAL_API_ERROR.statusCode,
              cause: error instanceof Error ? error : undefined,
            },
          ),
        );
      }
    }
  };

  public createLyricsPlaylist = async (
    req: AuthenticatedRequest,
    res: Response<PlaylistActionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistData: LyricsPlaylistRequest = {
        ...req.body,
        userId: req.user!.id,
        prefer_latest: req.body.prefer_latest ?? true,
      };

      const modelResponse = await axios.post<AIModelResponse>(
        `${config.AI_MODEL_URL}/myplaylist`,
        playlistData,
      );

      res.status(200).json({
        success: true,
        message: '가사 기반 플레이리스트가 생성되었습니다.',
        recommendedPlaylist: modelResponse.data,
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 422) {
        next(
          new AppError(COMMON_ERROR.VALIDATION_ERROR.name, '가사 검색어가 올바르지 않습니다', {
            statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode,
            cause: error,
          }),
        );
      } else {
        next(
          new AppError(
            COMMON_ERROR.EXTERNAL_API_ERROR.name,
            'AI 모델 서버 연동 중 오류가 발생했습니다',
            {
              statusCode: COMMON_ERROR.EXTERNAL_API_ERROR.statusCode,
              cause: error instanceof Error ? error : undefined,
            },
          ),
        );
      }
    }
  };

  public savePlaylist = async (
    req: AuthenticatedRequest,
    res: Response<PlaylistActionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const saveData: SavePlaylistRequest = {
        title: req.body.title,
        userId: req.user!.id,
        tracks: req.body.tracks,
      };

      const savedPlaylist = await playlistService.savePlaylist(saveData);

      res.status(201).json({
        success: true,
        message: '플레이리스트가 저장되었습니다.',
        playlist: savedPlaylist,
      });
    } catch (error) {
      next(error);
    }
  };

  public getPlaylistById = async (
    req: AuthenticatedRequest,
    res: Response<PlaylistActionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistId = Number(req.params.playlistId);
      const playlist = await playlistService.findById(playlistId);

      res.json({
        success: true,
        message: '플레이리스트를 조회했습니다.',
        playlist,
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePlaylistTitle = async (
    req: AuthenticatedRequest,
    res: Response<PlaylistActionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistId = Number(req.params.playlistId);
      const updateData: UpdatePlaylistTitleRequest = {
        newTitle: req.body.newTitle,
      };

      const updatedPlaylist = await playlistService.updateTitle(playlistId, updateData);

      res.json({
        success: true,
        message: '플레이리스트 제목이 업데이트되었습니다.',
        playlist: updatedPlaylist,
      });
    } catch (error) {
      next(error);
    }
  };

  public deletePlaylist = async (
    req: AuthenticatedRequest,
    res: Response<PlaylistActionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistId = Number(req.params.playlistId);
      await playlistService.delete(playlistId);

      res.json({
        success: true,
        message: '플레이리스트가 삭제되었습니다.',
      });
    } catch (error) {
      next(error);
    }
  };
}

export const playlistController = PlaylistController.getInstance();
