import dotenv from 'dotenv';
import path from 'path';
import { Config } from '@/shared/types/common';
import { AppError, COMMON_ERROR } from '@/shared/utils/errors';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

function validateEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new AppError(
      COMMON_ERROR.CONFIG_ERROR.name,
      `Missing required environment variable: ${name}`,
      { statusCode: COMMON_ERROR.CONFIG_ERROR.statusCode },
    );
  }
  return value;
}

function createConfig(): Config {
  return {
    // Server
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: parseInt(process.env.PORT ?? '8888', 10),
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    SESSION_SECRET: validateEnvVar('SESSION_SECRET', process.env.SESSION_SECRET),
    COOKIE_SECRET: validateEnvVar('COOKIE_SECRET', process.env.COOKIE_SECRET),
    AI_MODEL_URL: validateEnvVar('AI_MODEL_URL', process.env.AI_MODEL_URL),

    // Database
    MYSQL_USER: validateEnvVar('MYSQL_USER', process.env.MYSQL_USER),
    MYSQL_PW: validateEnvVar('MYSQL_PW', process.env.MYSQL_PW),
    MYSQL_HOST: validateEnvVar('MYSQL_HOST', process.env.MYSQL_HOST),
    MYSQL_NAME: validateEnvVar('MYSQL_NAME', process.env.MYSQL_NAME),
    DATABASE_URL: validateEnvVar('DATABASE_URL', process.env.DATABASE_URL),

    // Auth
    GOOGLE_CLIENT_ID: validateEnvVar('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID),
    GOOGLE_CLIENT_SECRET: validateEnvVar('GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET),
    GOOGLE_REDIRECT_URI: validateEnvVar('GOOGLE_REDIRECT_URI', process.env.GOOGLE_REDIRECT_URI),
    SPOTIFY_CLIENT_ID: validateEnvVar('SPOTIFY_CLIENT_ID', process.env.SPOTIFY_CLIENT_ID),
    SPOTIFY_CLIENT_SECRET: validateEnvVar(
      'SPOTIFY_CLIENT_SECRET',
      process.env.SPOTIFY_CLIENT_SECRET,
    ),
    SPOTIFY_REDIRECT_URI: validateEnvVar('SPOTIFY_REDIRECT_URI', process.env.SPOTIFY_REDIRECT_URI),
  };
}

function validateConfig(config: Config): void {
  const uriVars = ['GOOGLE_REDIRECT_URI', 'SPOTIFY_REDIRECT_URI'] as const;

  for (const varName of uriVars) {
    const value = config[varName];
    if (!isValidUrl(value)) {
      throw new AppError(
        COMMON_ERROR.CONFIG_ERROR.name,
        `Invalid URL format for ${varName}: ${value}`,
        { statusCode: COMMON_ERROR.CONFIG_ERROR.statusCode },
      );
    }
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const config = createConfig();
validateConfig(config);

export default config;
