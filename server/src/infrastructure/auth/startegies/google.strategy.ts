import { Profile, Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { createLogger } from '@utils/logger';
import { authService } from '@auth/services/auth.service';
import config from '@/config';
import { OAuthProfile, AuthUser } from '@auth/types/auth.types';

const logger = createLogger(config);

const GOOGLE_CONFIG = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_REDIRECT_URI,
  scope: ['profile', 'email'] as const,
} as const;

export default new GoogleStrategy(
  GOOGLE_CONFIG,
  async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      const oauthProfile: OAuthProfile = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails ?? [],
        provider: 'google',
        photos: profile.photos,
      };

      const user = await authService.createOrUpdateUser(oauthProfile);
      const expiresAt = Date.now() + 3600 * 1000; // 1시간

      const authUser: AuthUser = {
        ...user,
        accessToken,
        refreshToken: refreshToken ?? '',
        expiresAt,
      };

      logger.info(`Google OAuth 인증 성공: ${user.email}`);
      done(null, authUser);
    } catch (error) {
      const error_ = error instanceof Error ? error : new Error('Unknown error');
      logger.error(`Google OAuth 에러: ${error_.message}`, { error: error_ });
      done(error_);
    }
  },
);
