import prisma from '../models/index.js';
import logger from '../utils/logger.js';
import { AppError, COMMON_ERROR } from '../utils/errors.js';

export const createOrUpdateUser = async (profile, provider) => {
  try {
    const user = await prisma.user.upsert({
      where: {
        provider_providerId: {
          provider: provider,
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
        provider: provider,
        providerId: profile.id,
      },
    });

    logger.info(`user 생성/업데이트: ${user.id}`);
    return user;
  } catch (error) {
    logger.error('user 생성/업데이트 중 에러 발생:', { stack: error.stack, cause: error.cause });
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'DB에서 사용자 생성/업데이트 중 문제가 발생하였습니다', { cause: error, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode });
  }
};

export const findUserById = async (id) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });
    if (!user) {
      throw new AppError(COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.name, `ID ${id}에 해당하는 사용자를 찾을 수 없습니다`, { statusCode: COMMON_ERROR.RESOURCE_NOT_FOUND_ERROR.statusCode });
    }
    return user;
  } catch (error) {
    logger.error(`user id 찾기 중 오류: ${id}`, { stack: error.stack, cause: error.cause });
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, `DB에서 사용자 조회 중 문제가 발생하였습니다`, { cause: error, statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode });
  }
};
