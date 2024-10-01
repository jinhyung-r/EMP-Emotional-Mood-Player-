import axios from 'axios';
import config from '../config/index.js';
import logger from '../utils/logger.js';
import { AppError, UnauthorizedError, BadRequestError } from '../utils/errors.js';

export const refreshAccessToken = async (refreshToken, provider) => {
  if (!refreshToken) {
    throw new UnauthorizedError('리프레시 토큰이 없습니다.');
  }

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

    const { access_token, refresh_token, expires_in } = response.data;
    const newExpiresAt = Date.now() + expires_in * 1000;

    logger.info(`토큰 리프레시 완료: ${provider}`);

    return {
      accessToken: access_token,
      refreshToken: refresh_token ?? refreshToken,
      expiresAt: newExpiresAt,
    };
  } catch (error) {
    logger.error(`토큰 리프레시 중 오류: ${error.message}`);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new BadRequestError('잘못된 리프레시 토큰');
      } else if (error.response?.status === 401) {
        throw new UnauthorizedError('인증 실패');
      }
    }
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
      throw new BadRequestError('지원하지 않는 로그인 플랫폼');
  }
}