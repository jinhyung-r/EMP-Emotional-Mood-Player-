import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/auth/types/auth.types';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { userService } from '@users/services/user.service';
import { createLogger } from '@utils/logger';
import { UserDTO, CreateUserDTO, UpdateProfileDTO } from '@users/types/user.types';
import config from '@/config';

export class UserController {
  private static instance: UserController;
  private readonly logger = createLogger(config);

  private constructor() {}

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public getUserInfo = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(
          COMMON_ERROR.AUTHENTICATION_ERROR.name,
          '사용자 정보를 찾을 수 없습니다.',
          { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode },
        );
      }

      const user = await userService.findById(req.user.id);

      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        throw new AppError(
          COMMON_ERROR.AUTHENTICATION_ERROR.name,
          '사용자 정보를 찾을 수 없습니다.',
          { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode },
        );
      }

      const updateData: UpdateProfileDTO = req.body;

      // 이메일 변경은 제한할 수 있습니다
      if (updateData.email) {
        throw new AppError(
          COMMON_ERROR.VALIDATION_ERROR.name,
          'OAuth 인증된 사용자의 이메일은 변경할 수 없습니다.',
          { statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode },
        );
      }

      const updatedUser = await userService.updateProfile(req.user.id, updateData);

      res.json({
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          provider: updatedUser.provider,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = UserController.getInstance();
