import { prisma } from '@/infrastructure/database/prisma';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { createLogger } from '@utils/logger';
import { User } from '@prisma/client';
import { CreateUserDTO, UpdateProfileDTO } from '@/users/types/user.types';
import config from '@/config';
import { OAuthProfile } from '@/auth/types/auth.types';

export class UserService {
  private static instance: UserService;
  private readonly logger = createLogger(config);

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async createOrUpdateUser(profile: OAuthProfile): Promise<User> {
    try {
      const user = await prisma.user.upsert({
        where: {
          provider_providerId: {
            provider: profile.provider,
            providerId: profile.id,
          },
        },
        update: {
          email: profile.emails[0].value,
          name: profile.displayName,
        },
        create: {
          email: profile.emails[0].value,
          name: profile.displayName,
          provider: profile.provider,
          providerId: profile.id,
        },
      });

      this.logger.info(`사용자 생성/업데이트 완료: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error('사용자 생성/업데이트 중 오류:', error);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '사용자 정보 처리 중 오류가 발생했습니다',
        {
          statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
          cause: error instanceof Error ? error : undefined,
        },
      );
    }
  }

  public async updateProfile(userId: number, data: UpdateProfileDTO): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data,
      });

      this.logger.info(`사용자 프로필 업데이트 완료: ${userId}`);
      return user;
    } catch (error) {
      this.logger.error('사용자 프로필 업데이트 중 오류:', error);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '사용자 정보 업데이트 중 오류가 발생했습니다',
        {
          statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
          cause: error instanceof Error ? error : undefined,
        },
      );
    }
  }

  public async findById(id: number): Promise<User> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new AppError(
          COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.name,
          `ID ${id}에 해당하는 사용자를 찾을 수 없습니다`,
          { statusCode: COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.statusCode },
        );
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;

      this.logger.error('사용자 조회 중 오류:', error);
      throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB 조회 중 오류가 발생했습니다', {
        statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
        cause: error instanceof Error ? error : undefined,
      });
    }
  }
}

export const userService = UserService.getInstance();
