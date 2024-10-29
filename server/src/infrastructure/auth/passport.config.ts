import passport from 'passport';
import { createLogger } from '@utils/logger';
import config from '@/config';
import googleStrategy from '@/infrastructure/auth/startegies/google.strategy';
import spotifyStrategy from '@/infrastructure/auth/startegies/spotify.strategy';
import { AuthUser } from '@/auth/types/auth.types';

const logger = createLogger(config);

export const configurePassport = (): void => {
  passport.use(googleStrategy);
  passport.use(spotifyStrategy);

  passport.serializeUser((user: AuthUser, done) => {
    logger.debug('Serializing user:', { userId: user.id });
    done(null, {
      id: user.id,
      provider: user.provider,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      expiresAt: user.expiresAt,
    });
  });

  passport.deserializeUser(async (serializedUser: AuthUser, done) => {
    try {
      logger.debug('Deserializing user:', { userId: serializedUser.id });
      done(null, serializedUser);
    } catch (error) {
      const error_ = error instanceof Error ? error : new Error('Unknown error');
      logger.error('사용자 역직렬화 중 에러:', error_);
      done(error_);
    }
  });
};
