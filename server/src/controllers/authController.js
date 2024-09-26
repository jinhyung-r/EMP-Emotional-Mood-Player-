import { UserDTO } from '../DTOs/userDTO.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';

export const oauthCallback = (req, res, next) => {
  try {
    const user = req.user;
    logger.debug('user obj:', user);
    if (!user) {
      throw new UnauthorizedError('인증에 실패했습니다.');
    }

    const userDto = UserDTO.fromEntity(user);
    req.session.user = userDto.toJSON();

    logger.info(`User authenticated: ${userDto.getId()}`);
    logger.info(`Provider: ${userDto.getProvider()}`);

    res.json({
      success: true,
      user: userDto.toJSON(),
      message: '인증이 완료되었습니다.',
    });
  } catch (error) {
    logger.debug('oauth err', error);
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
