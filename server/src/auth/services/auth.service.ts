import { Provider } from '@prisma/client';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { prisma } from '@/infrastructure/database/prisma.service';
import { createLogger } from '@utils/logger';
import { RefreshTokenParams, TokenInfo, OAuthProfile, AuthUser } from '../types/auth.types';
import config from '@/config';
import axios from 'axios';

export class AuthService {
  private static instance: AuthService;
  private readonly logger = createLogger(config);

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async createOrUpdateUser(profile: OAuthProfile): Promise<AuthUser> {
    try {
      const user = await prisma.user.upsert({
        where: {
          provider_providerId: {
            provider: profile.provider,
            providerId: profile.id,
          },
        },
        update: {
          email: profile.emails[0].value,
          name: profile.displayName,
        },
        create: {
          email: profile.emails[0].value,
          name: profile.displayName,
          provider: profile.provider,
          providerId: profile.id,
        },
      });

      return user as AuthUser;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error('사용자 생성/업데이트 중 오류:', err);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '사용자 정보 처리 중 오류가 발생했습니다',
        {
          statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
          cause: err,
        },
      );
    }
  }

  public async refreshToken(params: RefreshTokenParams): Promise<TokenInfo> {
    try {
      const { refreshToken, provider } = params;
      const providerConfig = this.getProviderConfig(provider);

      const response = await axios.post(providerConfig.tokenUrl, null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: providerConfig.clientId,
          client_secret: providerConfig.clientSecret,
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;
      const expiresAt = Date.now() + expires_in * 1000;

      return {
        accessToken: access_token,
        refreshToken: refresh_token ?? refreshToken,
        expiresAt,
      };
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      this.logger.error('토큰 리프레시 실패:', err);
      throw new AppError(COMMON_ERROR.EXTERNAL_API_ERROR.name, '토큰 리프레시에 실패했습니다', {
        statusCode: COMMON_ERROR.EXTERNAL_API_ERROR.statusCode,
        cause: err,
      });
    }
  }

  public validateSession(user?: AuthUser): boolean {
    if (!user?.expiresAt) return false;
    return Date.now() < user.expiresAt;
  }

  private getProviderConfig(provider: Provider) {
    const configs = {
      [Provider.google]: {
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
      },
      [Provider.spotify]: {
        tokenUrl: 'https://accounts.spotify.com/api/token',
        clientId: config.SPOTIFY_CLIENT_ID,
        clientSecret: config.SPOTIFY_CLIENT_SECRET,
      },
    };

    return configs[provider];
  }
}

export const authService = AuthService.getInstance();
