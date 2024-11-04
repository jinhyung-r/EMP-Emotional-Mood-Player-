import { Strategy as SpotifyStrategy, StrategyOptionsWithRequest, Profile } from 'passport-spotify'; // Profile 타입을 별도로 가져옴
import { createLogger } from '@utils/logger';
import { authService } from '@auth/services/auth.service';
import { OAuthProfile, AuthUser } from '@auth/types/auth.types';
import config from '@/config';
import { Request } from 'express';
import { Provider } from '@prisma/client';

const logger = createLogger(config);

const SPOTIFY_CONFIG: StrategyOptionsWithRequest = {
  clientID: config.SPOTIFY_CLIENT_ID,
  clientSecret: config.SPOTIFY_CLIENT_SECRET,
  callbackURL: config.SPOTIFY_REDIRECT_URI,
  scope: ['user-read-email', 'user-read-private', 'streaming'],
  passReqToCallback: true,
} as const;

export default new SpotifyStrategy(
  SPOTIFY_CONFIG,
  async (
    _req: Request,
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    profile: Profile, // Profile을 직접 지정
    done: (error?: Error | null, user?: AuthUser) => void,
  ) => {
    try {
      const oauthProfile: OAuthProfile = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails ?? [],
        provider: Provider.spotify,
        photos: profile.photos ? profile.photos.map((url) => ({ value: url })) : undefined,
      };

      const user = await authService.createOrUpdateUser(oauthProfile);
      const expiresAt = Date.now() + expiresIn * 1000;

      const authUser: AuthUser = {
        ...user,
        accessToken,
        refreshToken,
        expiresAt,
      };

      logger.info(`Spotify OAuth 인증 성공: ${user.email}`);
      done(null, authUser);
    } catch (error) {
      const error_ = error instanceof Error ? error : new Error('Unknown error');
      logger.error(`Spotify OAuth 에러: ${error_.message}`, { error: error_ });
      done(error_);
    }
  },
);
