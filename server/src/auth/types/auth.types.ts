import { User, Provider } from '@prisma/client';
import { Session } from 'express-session';
import { Request } from 'express';

// Prisma User 타입 확장
export interface AuthUser extends User {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Token 관련 타입
export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface RefreshTokenParams {
  refreshToken: string;
  provider: Provider;
}

// OAuth Profile 타입
export interface OAuthProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  provider: Provider;
  photos?: Array<{ value: string }>;
}

// Session & Request 확장
export interface AuthSession extends Session {
  user?: AuthUser;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
  session: AuthSession;
}

// Response 타입
export interface OAuthCallbackResponse {
  success: boolean;
  user: Pick<AuthUser, 'id' | 'email' | 'name' | 'provider'>;
  playlistId?: number;
  message: string;
}
