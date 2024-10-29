import { Provider } from '@/shared/types/provider';
import { Request } from 'express';
import { Session } from 'express-session';
import { User } from '@prisma/client';

export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthSession extends Session {
  user?: AuthUser;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  session: AuthSession;
}

export interface RefreshTokenParams {
  refreshToken: string;
  provider: Provider;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface OAuthProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  provider: Provider;
  photos?: Array<{ value: string }>;
}

export interface ProviderConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  tokenUrl: string;
}

export interface OAuthCallbackResponse {
  success: boolean;
  user: {
    id: number;
    email: string;
    name: string;
    provider: Provider;
  };
  playlistId?: number | null;
  message: string;
}

export interface RefreshTokenParams {
  refreshToken: string;
  provider: Provider;
}
