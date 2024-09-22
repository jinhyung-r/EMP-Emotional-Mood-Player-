import { UserDTO } from '../dtos/index.js';
import logger from '../utils/logger.js';
import config from '../config/index.js';

export const oauthCallback = (req, res) => {
  const user = req.user;
  logger.info(`Raw user object: ${JSON.stringify(user)}`);

  const userDto = UserDTO.fromEntity(user);
  req.session.user = userDto.toJSON();

  // 로거는 나중에 지우기
  logger.info(`User authenticated: ${user.id}`);
  logger.info(`Provider: ${user.provider}`);
  logger.info(`Access Token: ${user.accessToken}`); 
  logger.info(`Refresh Token: ${user.refreshToken}`);
  logger.info(`Token expires at: ${new Date(user.expiresAt).toISOString()}`);
  
  // 일단은 벡에서 프론트로 json응답을 보내는 방식으로 사용(200코드 보내는 방식도 고려해보면 좋을듯)
  // 유저에 따른 응답값 구현 필요(아직 모델 구성 전이라 그 후에 진행)
  // 아예 json에 플레이리스트 값을 추가해서 보내는 방식도 괜찮을듯? -> 인가 완료 및 플레이리스트 없음 or 있음
  res.json({
    success: true,
    user: userDto.toJSON(),
    message: '인가 완료'
  });

  // res.status(200)?
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
