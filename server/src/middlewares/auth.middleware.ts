import { Request, Response, NextFunction } from 'express';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { createLogger } from '@utils/logger';
import { AuthenticatedRequest } from '@/auth/types/auth.types';
import { authService } from '@/auth/services/auth.service';
import { prisma } from '@/infrastructure/database';
import config from '@/config';

const logger = createLogger(config);

export class AuthMiddleware {
  private static instance: AuthMiddleware;

  private constructor() {}

  public static getInstance(): AuthMiddleware {
    if (!AuthMiddleware.instance) {
      AuthMiddleware.instance = new AuthMiddleware();
    }
    return AuthMiddleware.instance;
  }

  public isAuthenticated = (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.isAuthenticated()) {
      throw new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '인증이 필요한 요청입니다.', {
        statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode,
      });
    }
    next();
  };

  public checkAndRefreshToken = async (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authenticatedReq = req as AuthenticatedRequest;

    if (!authenticatedReq.isAuthenticated() || !authenticatedReq.user) {
      next(
        new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '인증이 필요합니다.', {
          statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode,
        }),
      );
      return;
    }

    try {
      const user = authenticatedReq.user;

      if (!authService.validateSession(user)) {
        logger.warn(`토큰 만료 user: ${user.id}`);

        if (!user.refreshToken || !user.provider) {
          throw new AppError(
            COMMON_ERROR.AUTHENTICATION_ERROR.name,
            '리프레시 토큰이 없습니다. 다시 로그인해주세요.',
            { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode },
          );
        }

        const tokenInfo = await authService.refreshToken({
          refreshToken: user.refreshToken,
          provider: user.provider,
        });

        user.accessToken = tokenInfo.accessToken;
        user.refreshToken = tokenInfo.refreshToken;
        user.expiresAt = tokenInfo.expiresAt;

        await new Promise<void>((resolve, reject) => {
          authenticatedReq.session.save((err) => {
            if (err) {
              logger.error('세션 저장 중 오류:', { stack: err.stack, cause: err.cause });
              reject(
                new AppError(
                  COMMON_ERROR.DATABASE_ERROR.name,
                  '세션 저장 중 오류가 발생했습니다.',
                  { cause: err, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode },
                ),
              );
            }
            resolve();
          });
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };

  public checkPermission = (resource: string) => {
    return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
      const authenticatedReq = req as AuthenticatedRequest;
      const resourceId = Number(req.params[`${resource}Id`]);

      if (isNaN(resourceId)) {
        next(
          new AppError(COMMON_ERROR.VALIDATION_ERROR.name, '유효하지 않은 리소스 ID입니다.', {
            statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode,
          }),
        );
        return;
      }

      try {
        const hasPermission = await this.verifyResourceOwnership(
          resource,
          resourceId,
          authenticatedReq.user!.id,
        );

        if (!hasPermission) {
          throw new AppError(
            COMMON_ERROR.AUTHORIZATION_ERROR.name,
            '해당 리소스에 대한 접근 권한이 없습니다.',
            { statusCode: COMMON_ERROR.AUTHORIZATION_ERROR.statusCode },
          );
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };

  private async verifyResourceOwnership(
    resource: string,
    resourceId: number,
    userId: number,
  ): Promise<boolean> {
    switch (resource) {
      case 'playlist':
        const playlist = await prisma.playlist.findUnique({
          where: { playlistId: resourceId },
          select: { userId: true },
        });
        return playlist?.userId === userId;

      default:
        throw new AppError(COMMON_ERROR.VALIDATION_ERROR.name, '지원하지 않는 리소스 타입입니다.', {
          statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode,
        });
    }
  }
}

export const authMiddleware = AuthMiddleware.getInstance();
