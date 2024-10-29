import axios, { AxiosError } from 'axios';
import { Provider } from '@/shared/types/provider';
import { prisma } from '@/infrastructure/database/prisma';
import { AppError, COMMON_ERROR } from '@/shared/utils/errors';
import { createLogger } from '@/shared/utils/logger';
import config from '@/config';
import {
  TokenInfo,
  ProviderConfig,
  OAuthProfile,
  AuthUser,
  PrismaUser,
  RefreshTokenParams,
} from '@auth/types/auth.types';

const logger = createLogger(config);

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private getProviderConfig(provider: Provider): ProviderConfig {
    const configs: Record<Provider, ProviderConfig> = {
      google: {
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        redirectUri: config.GOOGLE_REDIRECT_URI,
        scope: ['profile', 'email'],
        tokenUrl: 'https://oauth2.googleapis.com/token',
      },
      spotify: {
        clientId: config.SPOTIFY_CLIENT_ID,
        clientSecret: config.SPOTIFY_CLIENT_SECRET,
        redirectUri: config.SPOTIFY_REDIRECT_URI,
        scope: ['user-read-email', 'user-read-private', 'streaming'],
        tokenUrl: 'https://accounts.spotify.com/api/token',
      },
    };

    const providerConfig = configs[provider];
    if (!providerConfig) {
      throw new AppError(COMMON_ERROR.ARGUMENT_ERROR.name, '지원하지 않는 인증 제공자입니다.', {
        statusCode: COMMON_ERROR.ARGUMENT_ERROR.statusCode,
      });
    }

    return providerConfig;
  }

  public async refreshAccessToken({
    refreshToken,
    provider,
  }: RefreshTokenParams): Promise<TokenInfo> {
    try {
      const providerConfig = this.getProviderConfig(provider);

      const response = await axios.post<{
        access_token: string;
        refresh_token?: string;
        expires_in: number;
      }>(providerConfig.tokenUrl, null, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: providerConfig.clientId,
          client_secret: providerConfig.clientSecret,
        },
      });

      const { access_token, refresh_token, expires_in } = response.data;
      const expiresAt = Date.now() + expires_in * 1000;

      logger.info(`토큰 리프레시 완료: ${provider}`);

      return {
        accessToken: access_token,
        refreshToken: refresh_token ?? refreshToken,
        expiresAt,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error(`토큰 리프레시 중 오류: ${error.message}`);

        if (error.response?.status === 400) {
          throw new AppError(COMMON_ERROR.ARGUMENT_ERROR.name, '유효하지 않은 리프레시 토큰', {
            statusCode: COMMON_ERROR.ARGUMENT_ERROR.statusCode,
            cause: error,
          });
        } else if (error.response?.status === 401) {
          throw new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '인증 실패', {
            statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode,
            cause: error,
          });
        }
      }

      const error_ = error as Error;
      throw new AppError(COMMON_ERROR.EXTERNAL_API_ERROR.name, '토큰 리프레시 실패', {
        statusCode: COMMON_ERROR.EXTERNAL_API_ERROR.statusCode,
        cause: error_,
      });
    }
  }

  public async createOrUpdateUser(profile: OAuthProfile): Promise<PrismaUser> {
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

      logger.info(`사용자 생성/업데이트 완료: ${user.id}`);
      return user;
    } catch (error) {
      const error_ = error as Error;
      logger.error('사용자 생성/업데이트 중 오류:', error_);
      throw new AppError(
        COMMON_ERROR.DATABASE_ERROR.name,
        '사용자 정보 처리 중 오류가 발생했습니다',
        { statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode, cause: error_ },
      );
    }
  }

  public isTokenExpired(expiresAt: number): boolean {
    return Date.now() >= expiresAt;
  }

  public validateSession(user?: AuthUser): boolean {
    if (!user?.expiresAt) {
      return false;
    }
    return !this.isTokenExpired(user.expiresAt);
  }
}

export const authService = AuthService.getInstance();
