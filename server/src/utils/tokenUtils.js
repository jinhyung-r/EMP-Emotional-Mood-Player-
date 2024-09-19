import axios from 'axios';
import config from '../config/index.js';
import logger from './logger.js';

export const isTokenExpired = (expiresAt) => {
  return Date.now() >= expiresAt;
};

export const refreshAccessToken = async (user) => {
  const { provider, refreshToken } = user;
  
  let tokenUrl, clientId, clientSecret;
  if (provider === 'google') {
    tokenUrl = 'https://oauth2.googleapis.com/token';
    clientId = config.GOOGLE_CLIENT_ID;
    clientSecret = config.GOOGLE_CLIENT_SECRET;
  } else if (provider === 'spotify') {
    tokenUrl = 'https://accounts.spotify.com/api/token';
    clientId = config.SPOTIFY_CLIENT_ID;
    clientSecret = config.SPOTIFY_CLIENT_SECRET;
  } else {
    throw new Error('지원하지 않은 로그인 서비스');
  }

  try {
    const response = await axios.post(tokenUrl, null, {
      params: {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: clientId,
        client_secret: clientSecret,
      },
    });

    const { access_token, refresh_token } = response.data;
    
    const newExpiresAt = Date.now() + 3600 * 1000; 

    logger.info(`엑세스 토큰 리프레시 완료: ${provider}`);

    return { 
      accessToken: access_token, 
      refreshToken: refresh_token, 
      expiresAt: newExpiresAt 
    };
  } catch (error) {
    logger.error(`리프레시 중 에러: ${error.message}`);
    throw error;
  }
};