import prisma from '../models/index.js';

export const findOrCreateUser = async (profile, provider) => {
  const user = await prisma.user.upsert({
    where: { email: profile.emails[0].value },
    update: {
      provider,
      providerId: profile.id,
    },
    create: {
      email: profile.emails[0].value,
      name: profile.displayName,
      provider,
      providerId: profile.id,
    },
  });
  return user;
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

// 차후 ERD 테이블 따라서 관계정의 필요
