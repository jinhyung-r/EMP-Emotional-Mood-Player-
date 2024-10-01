import logger from '../utils/logger.js';
import { UnauthorizedError } from '../utils/errors.js';
import { getUserFirstPlaylist } from '../services/playlistService.js';

export const oauthCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('인증에 실패했습니다.');
    }

    logger.debug(`User authenticated: ${req.user.id}`);
    logger.debug(`Provider: ${req.user.provider}`);

    const playlistId = await getUserFirstPlaylist(req.user.id) || [];

    logger.debug('First Playlist ID:', playlistId);

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