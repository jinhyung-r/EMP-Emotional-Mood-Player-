import dotenv from 'dotenv';
import path from 'path';

// 환경 변수 설정
// production일때는 도메인으로 변경하기(.env.production) - 아직 안함
// 설정 파일을 나눠놓는것도 좋을듯?

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PW: process.env.MYSQL_PW,
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_NAME: process.env.MYSQL_NAME,
  PORT: process.env.PORT || 8888,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
  SESSION_SECRET: process.env.SESSION_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
};


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
  'COOKIE_SECRET'
];

requiredEnvVars.forEach(varName => {
  if (!config[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

// uri 검증
const uriVars = ['GOOGLE_REDIRECT_URI', 'SPOTIFY_REDIRECT_URI'];
uriVars.forEach(varName => {
  if (config[varName] && !isValidUrl(config[varName])) {
    throw new Error(`Invalid URL format for ${varName}: ${config[varName]}`);
  }
});

// uri 유효성 검사 
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
    // 언더바 무시 추가(eslint)
  // eslint-disable-next-line no-unused-vars
  } catch (_) {
    return false;
  }
}


export default config;