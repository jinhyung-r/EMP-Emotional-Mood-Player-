import passport from 'passport';
import { findUserById } from '../services/userService.js';
import googleStrategy from './strategies/googleStrategy.js';
import spotifyStrategy from './strategies/spotifyStrategy.js';
import logger from '../utils/logger.js';

const configurePassport = () => {
  passport.use(googleStrategy);
  passport.use(spotifyStrategy);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (serializedUser, done) => {
    try {
      const { id, provider, accessToken, refreshToken, expiresAt } = serializedUser;
      const user = await findUserById(id);
      if (user) {
        user.provider = provider;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.expiresAt = expiresAt;
      }
      done(null, user);
    } catch (error) {
      logger.error(`역직렬화 중 에러: ${error.message}`);
      done(error, null);
    }
  });
};

export default configurePassport;