import { UserDTO } from '../DTOs/userDTO.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';
import { getUserFirstPlaylist } from '../services/playlistService.js';
import { checkLoginState } from '../services/authService.js';

export const oauthCallback = async (req, res, next) => {
  try {
    const user = req.user;
    logger.debug('user obj:', JSON.stringify(user, null, 2));
    if (!user) {
      throw new UnauthorizedError('인증에 실패했습니다.');
    }

    const userDto = UserDTO.fromEntity(user);
    req.session.user = userDto.toJSON();

    logger.debug(`User authenticated: ${userDto.getId()}`);
    logger.debug(`Provider: ${userDto.getProvider()}`);

    // 사용자의 첫 번째 플레이리스트 ID 조회
    const playlistId = await getUserFirstPlaylist(userDto.getId()) || [];

    logger.debug('First Playlist ID:', playlistId);

    res.json({
      success: true,
      user: userDto.toJSON(),
      playlistId: playlistId,
      message: '인증이 완료되었습니다.',
    });
  } catch (error) {
    logger.debug('oauth error', error);
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
    logger.debug(`사용자 로그아웃 완료: ${req.user?.email}`);
    res.json({ message: '로그아웃되었습니다.' });
  });
};

export const loginStateHandler = async (req, res, next) => {
  try {
    const { user } = req.body;
    const isLoggedIn = await checkLoginState(user);
    res.json({ isLoggedIn });
  } catch (error) {
    logger.error(`로그인 상태 확인 중 오류: ${error.message}`);
    next(error);
  }
};
