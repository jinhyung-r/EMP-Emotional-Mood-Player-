import db from '../models/index.js';
const { User } = db;


export const findOrCreateUser = async (profile, provider) => {
  const [user, created] = await User.findOrCreate({
    where: { 
      providerId: profile.id, 
      provider 
    },
    defaults: {
      email: profile.emails[0].value,
      name: profile.displayName
    }
  });
  return user;
};

export const findUserById = async (id) => {
  return await User.findByPk(id);
};

// 차후 ERD 테이블 따라서 관계정의 필요