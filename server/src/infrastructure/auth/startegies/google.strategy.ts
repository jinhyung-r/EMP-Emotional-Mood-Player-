import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
  StrategyOptionsWithRequest,
} from 'passport-google-oauth20';
import { createLogger } from '@utils/logger';
import { authService } from '@auth/services/auth.service';
import { OAuthProfile, AuthUser } from '@auth/types/auth.types';
import config from '@/config';
import { Provider } from '@prisma/client';
import { Request } from 'express';

const logger = createLogger(config);

// StrategyOptionsWithRequest 사용 + passreqTocallbakc 강제 true 설정
// passport의 type 안쓰면 에러뜸
const strategyConfig: StrategyOptionsWithRequest = {
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_REDIRECT_URI,
  scope: ['profile', 'email'] as const,
  passReqToCallback: true, // passReqToCallback은 반드시 true로 설정
};

export default new GoogleStrategy(
  strategyConfig,
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) => {
    try {
      const oauthProfile: OAuthProfile = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails ?? [],
        provider: Provider.GOOGLE,
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
      const err = error instanceof Error ? error : new Error('Unknown error');
      logger.error(`Google OAuth 에러: ${err.message}`, { error: err });
      done(err);
    }
  },
);
