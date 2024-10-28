import dotenv from 'dotenv';
import path from 'path';
import { Config } from '@/shared/types/common';

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const validateConfig = (config: Partial<Config>): config is Config => {
  const requiredEnvVars = [
    'MYSQL_USER',
    'MYSQL_PW',
    'MYSQL_HOST',
    'MYSQL_NAME',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URI',
    'SPOTIFY_CLIENT_ID',
    'SPOTIFY_CLIENT_SECRET',
    'SPOTIFY_REDIRECT_URI',
    'SESSION_SECRET',
    'COOKIE_SECRET',
  ];

  for (const envVar of requiredEnvVars) {
    if (!config[envVar as keyof Config]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  return true;
};

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const config = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PW: process.env.MYSQL_PW,
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_NAME: process.env.MYSQL_NAME,
  PORT: parseInt(process.env.PORT || '8888', 10),
  FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
} as const;

if (!validateConfig(config)) {
  throw new Error('Invalid configuration');
}

// URI 검증
const uriVars = ['GOOGLE_REDIRECT_URI', 'SPOTIFY_REDIRECT_URI'];
for (const varName of uriVars) {
  if (config[varName as keyof Config] && !isValidUrl(config[varName as keyof Config] as string)) {
    throw new Error(`Invalid URL format for ${varName}: ${config[varName as keyof Config]}`);
  }
}

export default config;
