import { Strategy as SpotifyStrategy } from 'passport-spotify';
import config from '../index.js';
import { findOrCreateUser } from '../../services/userService.js';
import logger from '../../utils/logger.js';

export default new SpotifyStrategy(
  {
    clientID: config.SPOTIFY_CLIENT_ID,
    clientSecret: config.SPOTIFY_CLIENT_SECRET,
    callbackURL: config.SPOTIFY_REDIRECT_URI,
    scope: ['user-read-email', 'user-read-private', 'streaming'],
  },
  async (accessToken, refreshToken, expires_in, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'spotify');
      const expiresAt = Date.now() + expires_in * 1000;

      // 스포티파이 인증 완료 후에 passport에 저장할 user정보를 전달
      done(null, {
        id: user.id,
        email: user.email,
        name: user.name,
        provider: user.provider,
        accessToken,
        refreshToken,
        expiresAt,
      });
    } catch (error) {
      logger.error(`스포티파이 로그인 에러: ${error.message}`, { error });
      done(error, null);
    }
  },
);