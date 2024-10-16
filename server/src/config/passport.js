import passport from 'passport';
import { findUserById } from '../services/userService.js';
import googleStrategy from './strategies/googleStrategy.js';
import spotifyStrategy from './strategies/spotifyStrategy.js';
import logger from '../utils/logger.js';

const configurePassport = () => {
  passport.use(googleStrategy);
  passport.use(spotifyStrategy);

  // user 인증 후에 저장할 애들을 결정
  passport.serializeUser((user, done) => {
    done(null, {
      id: user.id,
      provider: user.provider,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      expiresAt: user.expiresAt
    });
  });

  // 세션에서 사용자 정보를 복원 
  passport.deserializeUser(async (serializedUser, done) => {
    try {
      const user = await findUserById(serializedUser.id);
      if (user) {
        user.accessToken = serializedUser.accessToken;
        user.refreshToken = serializedUser.refreshToken;
        user.expiresAt = serializedUser.expiresAt;
      }
      done(null, user);
    } catch (error) {
      logger.error(`역직렬화 중 에러: ${error.message}`, { error });
      done(error, null);
    }
  });
};

export default configurePassport;