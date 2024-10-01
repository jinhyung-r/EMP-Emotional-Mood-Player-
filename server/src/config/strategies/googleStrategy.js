import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../index.js';
import { findOrCreateUser } from '../../services/userService.js';
import logger from '../../utils/logger.js';

export default new GoogleStrategy(
  {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.GOOGLE_REDIRECT_URI,
    scope: ['profile', 'email'],
    accessType: 'offline',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await findOrCreateUser(profile, 'google');
      const expiresAt = Date.now() + 3600 * 1000; // 1시간 후 만료

      // 구글 인증 완료 후에 passport에 저장할 user정보를 전달
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
      logger.error(`구글 로그인 에러: ${error.message}`, { error });
      done(error, null);
    }
  },
);