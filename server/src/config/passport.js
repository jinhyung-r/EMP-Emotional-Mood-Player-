import passport from 'passport';
import { findUserById } from '../services/userService.js';
import googleStrategy from './strategies/googleStrategy.js';
import spotifyStrategy from './strategies/spotifyStrategy.js';
import logger from '../utils/logger.js';

const configurePassport = () => {
  passport.use(googleStrategy);
  passport.use(spotifyStrategy);

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await findUserById(id);
      done(null, user);
    } catch (error) {
      logger.error(`역직렬화 중 에러: ${error.message}`);
      done(error, null);
    }
  });
};

export default configurePassport;