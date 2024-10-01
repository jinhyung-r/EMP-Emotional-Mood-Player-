import prisma from '../models/index.js';
import logger from '../utils/logger.js';

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
    logger.error('user 생성/업데이트 중 에러 발생:', error);
    throw error;
  }
};

export const findUserById = async (id) => {
  try {
    return await prisma.user.findUnique({
      where: { id: parseInt(id, 10) },
    });
  } catch (error) {
    logger.error(`user id 찾기 중 오류: ${id}`, error);
    throw error;
  }
};