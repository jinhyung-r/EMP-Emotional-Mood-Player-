// 사용자의 db에 따른 리다렉 경로 정의 필요
// playlist 존재하면 playlist, 없으면 /create로..

import { UserDTO } from '../dtos/userDto.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

export const oauthCallback = (req, res) => {
  const user = req.user;
  logger.info(`Raw user object: ${JSON.stringify(user)}`);

  const userDto = UserDTO.fromEntity(user);
  req.session.user = userDto.toJSON();

  logger.info(`User authenticated: ${user.id}`);
  logger.info(`Provider: ${user.provider}`);
  logger.info(`Access Token: ${user.accessToken}`); 
  logger.info(`Refresh Token: ${user.refreshToken}`);
  logger.info(`Token expires at: ${new Date(user.expiresAt).toISOString()}`);
  
  // 이부분은 프론트엔드로 리다렉이니 프론트엔드와 협의 필요
  // auth-success 라고 두었지만 뭐 정하고싶은대ㅐ로 지어도 상관없음, 그에 맞게 바꾸기
  res.redirect(`${config.FRONTEND_URL}/auth-success`);
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('세션 삭제 에러:', err);
    }
    res.clearCookie('auth_session');
    logger.info(`유저 로그아웃 완료: ${req.user?.email}`);
    res.redirect(`${config.FRONTEND_URL}/home`);
  });
};
