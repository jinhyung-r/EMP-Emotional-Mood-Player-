import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, OAuthCallbackResponse } from '@auth/types/auth.types';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { authService } from '@auth/services/auth.service';
import { playlistService } from '@playlists/services/playlist.service';
import { createLogger } from '@utils/logger';
import config from '@/config';

export class AuthController {
  private static instance: AuthController;
  private readonly logger = createLogger(config);

  private constructor() {}

  public static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  public oauthCallback = async (
    req: AuthenticatedRequest,
    res: Response<OAuthCallbackResponse>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '인증에 실패했습니다.', {
          statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode,
        });
      }

      this.logger.debug(`유저 인증 완료: ${req.user.id}`);
      this.logger.debug(`provider: ${req.user.provider}`);

      const playlists = await playlistService.findByUserId(req.user.id);
      const playlistId = playlists[0]?.playlistId;

      const response: OAuthCallbackResponse = {
        success: true,
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          provider: req.user.provider,
        },
        playlistId,
        message: '인증이 완료되었습니다.',
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user?.refreshToken || !req.user?.provider) {
        throw new AppError(
          COMMON_ERROR.AUTHENTICATION_ERROR.name,
          '인증되지 않았거나 유효하지 않은 세션입니다.',
          { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode },
        );
      }

      const tokenInfo = await authService.refreshToken({
        refreshToken: req.user.refreshToken,
        provider: req.user.provider,
      });

      // 세션 업데이트
      req.user.accessToken = tokenInfo.accessToken;
      req.user.refreshToken = tokenInfo.refreshToken;
      req.user.expiresAt = tokenInfo.expiresAt;

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            this.logger.error('세션 저장 중 오류:', { error: err });
            reject(
              new AppError(COMMON_ERROR.DATABASE_ERROR.name, '세션 저장 중 오류가 발생했습니다.', {
                statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
                cause: err,
              }),
            );
          }
          resolve();
        });
      });

      res.json({ accessToken: tokenInfo.accessToken });
    } catch (error) {
      next(error);
    }
  };

  public getSpotifyToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.isAuthenticated() || req.user?.provider !== 'spotify') {
        throw new AppError(
          COMMON_ERROR.AUTHENTICATION_ERROR.name,
          '인증되지 않았거나 Spotify 사용자가 아닙니다.',
          { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode },
        );
      }

      if (req.user.expiresAt > Date.now()) {
        res.json({ accessToken: req.user.accessToken });
      } else {
        res.status(401).json({ message: '액세스 토큰이 만료되었습니다. 갱신이 필요합니다.' });
      }
    } catch (error) {
      next(error);
    }
  };

  public refreshSpotifyToken = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.isAuthenticated() || req.user?.provider !== 'spotify') {
        throw new AppError(
          COMMON_ERROR.AUTHENTICATION_ERROR.name,
          '인증되지 않았거나 Spotify 사용자가 아닙니다.',
          { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode },
        );
      }

      if (!req.user.refreshToken) {
        throw new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '리프레시 토큰이 없습니다.', {
          statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode,
        });
      }

      const tokenInfo = await authService.refreshToken({
        refreshToken: req.user.refreshToken,
        provider: 'spotify',
      });

      // 세션의 유저 정보 업데이트
      req.user.accessToken = tokenInfo.accessToken;
      req.user.refreshToken = tokenInfo.refreshToken;
      req.user.expiresAt = tokenInfo.expiresAt;

      await new Promise<void>((resolve, reject) => {
        req.session.save((err) => {
          if (err) {
            this.logger.error('세션 저장 중 오류:', { error: err });
            reject(
              new AppError(COMMON_ERROR.DATABASE_ERROR.name, '세션 저장 중 오류가 발생했습니다.', {
                statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
                cause: err,
              }),
            );
          }
          resolve();
        });
      });

      res.json({ accessToken: tokenInfo.accessToken });
    } catch (error) {
      this.logger.error('Spotify 토큰 갱신 실패:', error);

      if (error instanceof AppError) {
        next(error);
      } else {
        next(
          new AppError(
            COMMON_ERROR.EXTERNAL_API_ERROR.name,
            '토큰 갱신에 실패했습니다. 다시 로그인해주세요.',
            {
              statusCode: COMMON_ERROR.EXTERNAL_API_ERROR.statusCode,
              cause: error instanceof Error ? error : undefined,
            },
          ),
        );
      }
    }
  };

  public logout = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userEmail = req.user?.email;

    req.logout((err) => {
      if (err) {
        this.logger.error('로그아웃 중 오류 발생:', err);
        return next(err);
      }

      res.clearCookie('auth_session', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });

      req.session.destroy((err) => {
        if (err) {
          this.logger.error('세션 파기 중 오류 발생:', err);
          return next(err);
        }
        this.logger.debug(`사용자 로그아웃 완료: ${userEmail}`);
        res.status(200).json({ success: true, message: '로그아웃되었습니다.' });
      });
    });
  };
}

export const authController = AuthController.getInstance();
