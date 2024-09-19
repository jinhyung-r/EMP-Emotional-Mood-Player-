import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errors.js';

export const refreshAccessToken = async (user) => {
  const { provider, refreshToken } = user;
  
  const providerConfig = getProviderConfig(provider);

  try {
    const response = await axios.post(providerConfig.tokenUrl, null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: providerConfig.clientId,
        client_secret: providerConfig.clientSecret,
      },
    });

    const { access_token, refresh_token } = response.data;
    const newExpiresAt = Date.now() + 3600 * 1000;    // 1시간 -> 다른 토큰들 나오는거랑 동일

    user.accessToken = access_token;
    if (refresh_token) {
      user.refreshToken = refresh_token;
    }
    user.expiresAt = newExpiresAt;

    await user.save();

    logger.info(`토큰 리프레시 완료: ${provider}`);

    return { 
      accessToken: access_token, 
      refreshToken: refresh_token, 
      expiresAt: newExpiresAt 
    };
  } catch (error) {
    logger.error(`토큰 리프레시 중 오류: ${error.message}`);
    throw new AppError('토큰 리프레시 실패', 500);
  }
};

function getProviderConfig(provider) {
  switch (provider) {
    case 'google':
      return {
        tokenUrl: 'https://oauth2.googleapis.com/token',
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
      };
    case 'spotify':
      return {
        tokenUrl: 'https://accounts.spotify.com/api/token',
        clientId: config.SPOTIFY_CLIENT_ID,
        clientSecret: config.SPOTIFY_CLIENT_SECRET,
      };
    default:
      throw new AppError('지원하지 않는 로그인 플랫폼', 400);
  }
}