import logger from '../utils/logger.js';
import { AppError, COMMON_ERROR } from '../utils/errors.js';
import { getUserFirstPlaylist } from '../services/playlistService.js';
import { refreshAccessToken } from '../services/tokenService.js';

export const oauthCallback = async (req, res, next) => {
  try {
    if (!req.user) {
      throw new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '인증에 실패했습니다.', { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode });
    }

    logger.debug(`유저 인증 완료: ${req.user.id}`);
    logger.debug(`provider: ${req.user.provider}`);

    const playlistId = await getUserFirstPlaylist(req.user.id);

    logger.debug('user의 first playlist:', { playlistId, stack: new Error().stack });
    logger.debug(`${req.user.id}`, { stack: new Error().stack });
    logger.debug(`${req.user.name}`, { stack: new Error().stack });
    logger.debug(`${req.user.provider}`, {stack: new Error().stack });

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
  const userEmail = req.user?.email;
  req.logout((err) => {
    if (err) {
      logger.error('로그아웃 중 오류 발생:', err);
      return next(err);
    }
    
    res.clearCookie('auth_session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/'
    });

    req.session.destroy((err) => {
      if (err) {
        logger.error('세션 파기 중 오류 발생:', err);
        return next(err);
      }
      logger.debug(`사용자 로그아웃 완료: ${userEmail}`);
      res.status(200).json({ success: true, message: '로그아웃되었습니다.' });
    });
  });
};

export const getSpotifyToken = (req, res, next) => {
  if (req.isAuthenticated() && req.user.provider === 'spotify') {
    if (req.user.expiresAt > Date.now()) {
      res.json({ accessToken: req.user.accessToken });
    } else {
      res.status(401).json({ message: '액세스 토큰이 만료되었습니다. 갱신이 필요합니다.' });
    }
  } else {
    next(new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '인증되지 않았거나 Spotify 사용자가 아닙니다.', { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode }));
  }
};

export const refreshSpotifyToken = async (req, res, next) => {
  if (!req.isAuthenticated() || req.user.provider !== 'spotify') {
    return next(new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '인증되지 않았거나 Spotify 사용자가 아닙니다.', { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode }));
  }

  try {
    const { accessToken, refreshToken, expiresAt } = await refreshAccessToken(req.user.refreshToken, 'spotify');
    
    req.user.accessToken = accessToken;
    req.user.refreshToken = refreshToken;
    req.user.expiresAt = expiresAt;

    req.session.save((err) => {
      if (err) {
        logger.error('세션 저장 중 오류:', { error: err });
        return next(new AppError(COMMON_ERROR.DATABASE_ERROR.name, '세션 저장 중 오류가 발생했습니다.', { statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode, cause: err }));
      }
      res.json({ accessToken });
    });
  } catch (error) {
    logger.error('Spotify 토큰 갱신 실패:', { error });
    next(new AppError(COMMON_ERROR.EXTERNAL_API_ERROR.name, '토큰 갱신에 실패했습니다. 다시 로그인해주세요.', { statusCode: COMMON_ERROR.EXTERNAL_API_ERROR.statusCode, cause: error }));
  }
};