import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { createLogger } from '@utils/logger';
import { authService } from '@auth/services/auth.service';
import config from '@/config';
import { OAuthProfile, AuthUser } from '@auth/types/auth.types';

const logger = createLogger(config);

const SPOTIFY_CONFIG = {
  clientID: config.SPOTIFY_CLIENT_ID,
  clientSecret: config.SPOTIFY_CLIENT_SECRET,
  callbackURL: config.SPOTIFY_REDIRECT_URI,
  scope: ['user-read-email', 'user-read-private', 'streaming'] as const,
} as const;

export default new SpotifyStrategy(
  SPOTIFY_CONFIG,
  async (
    accessToken: string,
    refreshToken: string,
    expiresIn: number,
    profile: SpotifyStrategy.Profile,
    done: (error?: Error | null, user?: AuthUser) => void,
  ) => {
    try {
      const oauthProfile: OAuthProfile = {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails ?? [],
        provider: 'spotify',
        photos: profile.photos,
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
