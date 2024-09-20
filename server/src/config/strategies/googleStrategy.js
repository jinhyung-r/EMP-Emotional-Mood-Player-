import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../index.js';
import { findOrCreateUser } from '../../services/userService.js';
import logger from '../../utils/logger.js';

export default new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_REDIRECT_URI,
  accessType: 'offline',  // 리프레시 토큰을 받기 위해 필요 무조건임!
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, 'google');
    const expiresAt = Date.now() + 3600 * 1000; // 1시간 뒤
    logger.info(`구글 유저 로그인 성공: ${user.id}`);               // 나중에 지울거(로그용)
    logger.info(`리프레시 토큰 받음: ${refreshToken ? 'Yes' : 'No'}`);    // 나중에 지울거 로그용
    done(null, { 
      id: user.id,
      provider: 'google',
      accessToken,
      refreshToken,
      expiresAt
    });
  } catch (error) {
    logger.error(`구글 로그인 에러: ${error.message}`);
    done(error, null);
  }
});