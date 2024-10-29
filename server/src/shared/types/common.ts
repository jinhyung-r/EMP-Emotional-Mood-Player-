export interface BaseResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

export interface ErrorOptions {
  statusCode?: number;
  cause?: Error;
}

export interface AuthConfig {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REDIRECT_URI: string;
  SPOTIFY_CLIENT_ID: string;
  SPOTIFY_CLIENT_SECRET: string;
  SPOTIFY_REDIRECT_URI: string;
}

export interface DatabaseConfig {
  MYSQL_USER: string;
  MYSQL_PW: string;
  MYSQL_HOST: string;
  MYSQL_NAME: string;
  DATABASE_URL: string;
}

export interface ServerConfig {
  NODE_ENV: string;
  PORT: number;
  FRONTEND_URL: string;
  SESSION_SECRET: string;
  COOKIE_SECRET: string;
  AI_MODEL_URL: string;
}

export type Config = AuthConfig & DatabaseConfig & ServerConfig;
