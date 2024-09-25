import { UserDTO } from '../dtos/index.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';

export const oauthCallback = (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError('인증에 실패했습니다.');
    }

    const userDto = UserDTO.fromEntity(user);
    req.session.user = userDto.toJSON();

    // 로거는 나중에 지우기
    /* 응답으로는 이렇게 보내줌
        {
      "success": true,
      "user": {
          "id": 3,
          "provider": "google",
          "accessToken": "Stored securely",
          "refreshToken": "Stored securely",
          "expiresAt": 1727161611746
      },
      "message": "인가 완료"
      } 
    */
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
      message: '인증이 완료되었습니다.',
    });
  } catch (error) {
    next(error);
  }
};

// 로그아웃은 프론트에서 리다렉하는게 나을지 모르겟음
// 응답받으면 리다렉시키는것도?
export const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      logger.error('세션 삭제 중 오류 발생:', err);
      return next(new InternalServerError('로그아웃 처리 중 오류가 발생했습니다.'));
    }
    res.clearCookie('auth_session');
    logger.info(`사용자 로그아웃 완료: ${req.user?.email}`);
    res.json({ message: '로그아웃되었습니다.' });
  });
};
