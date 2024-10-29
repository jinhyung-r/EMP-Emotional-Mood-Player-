import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { AuthenticatedRequest } from '@/auth/types/auth.types';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { playlistService } from '../services/playlist.service';
import { createLogger } from '@utils/logger';
import config from '@/config';
import {
  EmotionPlaylistRequest,
  LyricsPlaylistRequest,
  PlaylistResponse,
  UpdatePlaylistTitleRequest,
  PlaylistActionResponse,
} from '../types/playlist.types';

export class PlaylistController {
  private static instance: PlaylistController;
  private readonly logger = createLogger(config);

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

      this.logger.debug('AI 모델 서버로 보내는 데이터:', playlistData);

      const modelResponse = await axios.post<PlaylistResponse>(
        `${config.AI_MODEL_URL}/emotion-playlist`,
        playlistData,
      );

      this.logger.debug('AI 모델 서버 응답:', modelResponse.data);

      // AI 모델의 응답을 기반으로 플레이리스트 생성
      const savedPlaylist = await playlistService.createPlaylist({
        title: modelResponse.data.title || `${playlistData.genres} Playlist`,
        userId: req.user!.id,
        tracks: modelResponse.data.tracks,
      });

      res.status(201).json({
        success: true,
        message: '감정 기반 플레이리스트가 생성되었습니다.',
        playlist: savedPlaylist,
      });
    } catch (error) {
      this.logger.error('감정 기반 플레이리스트 생성 중 오류:', error);

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

      const modelResponse = await axios.post<PlaylistResponse>(
        `${config.AI_MODEL_URL}/lyrics-playlist`,
        playlistData,
      );

      const savedPlaylist = await playlistService.createPlaylist({
        title: modelResponse.data.title || `Lyrics: ${playlistData.searchTerm}`,
        userId: req.user!.id,
        tracks: modelResponse.data.tracks,
      });

      res.status(201).json({
        success: true,
        message: '가사 기반 플레이리스트가 생성되었습니다.',
        playlist: savedPlaylist,
      });
    } catch (error) {
      this.logger.error('가사 기반 플레이리스트 생성 중 오류:', error);

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

  public getPlaylistById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistId = Number(req.params.playlistId);
      if (isNaN(playlistId)) {
        throw new AppError(
          COMMON_ERROR.VALIDATION_ERROR.name,
          '유효하지 않은 플레이리스트 ID입니다.',
          { statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode },
        );
      }

      const playlist = await playlistService.findById(playlistId);

      // 권한 확인
      if (playlist.userId !== req.user!.id) {
        throw new AppError(
          COMMON_ERROR.AUTHORIZATION_ERROR.name,
          '해당 플레이리스트에 대한 접근 권한이 없습니다.',
          { statusCode: COMMON_ERROR.AUTHORIZATION_ERROR.statusCode },
        );
      }

      res.json(playlist);
    } catch (error) {
      next(error);
    }
  };

  /* 플레이리스트 각각은 아직 업데이트 기능 도입 예정 -> 현재는 playlistTitle만 업데이트
  public updatePlaylist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const playlistId = Number(req.params.playlistId);
      if (isNaN(playlistId)) {
        throw new AppError(
          COMMON_ERROR.VALIDATION_ERROR.name,
          '유효하지 않은 플레이리스트 ID입니다.',
          { statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode }
        );
      }

      const playlist = await playlistService.findById(playlistId);
      
      // 권한 확인
      if (playlist.userId !== req.user!.id) {
        throw new AppError(
          COMMON_ERROR.AUTHORIZATION_ERROR.name,
          '해당 플레이리스트에 대한 접근 권한이 없습니다.',
          { statusCode: COMMON_ERROR.AUTHORIZATION_ERROR.statusCode }
        );
      }

      const updateData: UpdatePlaylistDTO = req.body;
      const updatedPlaylist = await playlistService.update(playlistId, updateData);

      res.json(updatedPlaylist);
    } catch (error) {
      next(error);
    }
  };    
  
  */

  // title 업데이트
  public updatePlaylistTitle = async (
    req: AuthenticatedRequest,
    res: Response<PlaylistActionResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistId = Number(req.params.playlistId);
      if (isNaN(playlistId)) {
        throw new AppError(
          COMMON_ERROR.VALIDATION_ERROR.name,
          '유효하지 않은 플레이리스트 ID입니다.',
          { statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode },
        );
      }

      const { newTitle } = req.body as UpdatePlaylistTitleRequest;

      if (!newTitle || typeof newTitle !== 'string' || newTitle.trim().length === 0) {
        throw new AppError(COMMON_ERROR.VALIDATION_ERROR.name, '유효한 제목을 입력해주세요.', {
          statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode,
        });
      }

      const updatedPlaylist = await playlistService.updateTitle(playlistId, newTitle.trim());

      res.json({
        success: true,
        message: '플레이리스트 제목이 업데이트되었습니다.',
        playlist: updatedPlaylist,
      });
    } catch (error) {
      this.logger.error('플레이리스트 제목 수정 중 오류:', error);
      next(error);
    }
  };

  public deletePlaylist = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const playlistId = Number(req.params.playlistId);
      if (isNaN(playlistId)) {
        throw new AppError(
          COMMON_ERROR.VALIDATION_ERROR.name,
          '유효하지 않은 플레이리스트 ID입니다.',
          { statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode },
        );
      }

      const playlist = await playlistService.findById(playlistId);

      // 권한 확인
      if (playlist.userId !== req.user!.id) {
        throw new AppError(
          COMMON_ERROR.AUTHORIZATION_ERROR.name,
          '해당 플레이리스트에 대한 접근 권한이 없습니다.',
          { statusCode: COMMON_ERROR.AUTHORIZATION_ERROR.statusCode },
        );
      }

      await playlistService.delete(playlistId);

      res.json({ success: true, message: '플레이리스트가 삭제되었습니다.' });
    } catch (error) {
      next(error);
    }
  };
}

export const playlistController = PlaylistController.getInstance();
