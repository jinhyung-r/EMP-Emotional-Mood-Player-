import logger from '../utils/logger.js';
import { UnauthorizedError } from '../utils/errors.js';
import { getUserFirstPlaylist } from '../services/playlistService.js';
import { refreshAccessToken } from '../services/tokenService.js';

export const oauthCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증에 실패했습니다.');
    }

    logger.debug(`유저 인증 완료: ${req.user.id}`);
    logger.debug(`provider: ${req.user.provider}`);

    const playlistId = await getUserFirstPlaylist(req.user.id) ?? [];

    // 어차피 디버그용
    logger.debug('user의 first playlist:', playlistId);
    logger.debug(`${req.user.id}`);
    logger.debug(`${req.user.name}`);
    logger.debug(`${req.user.provider}`);
    logger.debug(`${playlistId}`);
    
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        provider: req.user.provider
      },
      playlistId: playlistId,
      message: '인증이 완료되었습니다.',
    });
  } catch (error) {
    logger.debug('oauth error', error);
    next(error);
  }
};

export const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      logger.error('로그아웃 중 오류 발생:', err);
      return next(err);
    }
    res.clearCookie('auth_session');
    logger.debug(`사용자 로그아웃 완료: ${req.user?.email}`);
    res.json({ message: '로그아웃되었습니다.' });
  });
};


// 스포티파이 토큰 가져오기
export const getSpotifyToken = (req, res) => {
  if (req.isAuthenticated() && req.user.provider === 'spotify') {
    if (req.user.expiresAt > Date.now()) {
      res.json({ accessToken: req.user.accessToken });
    } else {
      res.status(401).json({ message: '액세스 토큰이 만료되었습니다. 갱신이 필요합니다.' });
    }
  } else {
    res.status(401).json({ message: '인증되지 않았거나 Spotify 사용자가 아닙니다.' });
  }
};

// 스포티파이 토큰 업데이트
export const refreshSpotifyToken = async (req, res, next) => {
  if (!req.isAuthenticated() || req.user.provider !== 'spotify') {
    return next(new UnauthorizedError('인증되지 않았거나 Spotify 사용자가 아닙니다.'));
  }

  try {
    const { accessToken, refreshToken, expiresAt } = await refreshAccessToken(req.user.refreshToken, 'spotify');
    
    // user 업데이트
    req.user.accessToken = accessToken;
    req.user.refreshToken = refreshToken;
    req.user.expiresAt = expiresAt;

    // 세션 저장
    req.session.save((err) => {
      if (err) {
        logger.error('세션 저장 중 오류:', err);
        return next(err);
      }
      res.json({ accessToken });
    });
  } catch (error) {
    logger.error('Spotify 토큰 갱신 실패:', error);
    next(new UnauthorizedError('토큰 갱신에 실패했습니다. 다시 로그인해주세요.'));
  }
};