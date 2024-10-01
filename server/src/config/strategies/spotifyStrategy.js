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
      const expiresAt = Date.now() + expires_in * 1000; // 액세스 토큰 만료 시간 설정

      logger.debug(`스포티파이 유저 로그인 성공: ${user.id}`);
      logger.debug(`리프레시 토큰 받음: ${refreshToken ? 'Yes' : 'No'}`);

      done(null, {
        id: user.id,
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