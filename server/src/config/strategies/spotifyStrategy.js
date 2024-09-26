import { Strategy as SpotifyStrategy } from 'passport-spotify';
import config from '../index.js';
import { findOrCreateUser } from '../../services/userService.js';
import logger from '../../utils/logger.js';

export default new SpotifyStrategy(
  {
    clientID: config.SPOTIFY_CLIENT_ID,
    clientSecret: config.SPOTIFY_CLIENT_SECRET,
    callbackURL: config.SPOTIFY_REDIRECT_URI,
    scope: ['profile', 'email'],
  },
  async (accessToken, refreshToken, expires_in, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'spotify');
      const expiresAt = Date.now() + expires_in * 1000; // 1시간, 구글 스프토파이 동일
      logger.debug(`스포티파이 로그인 성공: ${user.id}`);
      logger.debug(`리프레시 토큰 받음: ${refreshToken ? 'yes' : 'No'}`);
      done(null, {
        id: user.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        provider: 'spotify',
        accessToken,
        refreshToken,
        expiresAt,
      });
    } catch (error) {
      logger.error(`스포티파이 로그인 에러: ${error.message}`);
      done(error, null);
    }
  },
);
