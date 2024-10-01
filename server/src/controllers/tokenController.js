import axios from 'axios';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export const proxySpotifyRequest = async (req, res, next) => {
  const { method, endpoint, data } = req.body;
  const user = req.user;

  if (!user || !user.accessToken) {
    return next(new UnauthorizedError('인증되지 않은 사용자입니다.'));
  }

  try {
    const response = await axios({
      method: method,
      url: `https://api.spotify.com/v1${endpoint}`,
      headers: {
        'Authorization': `Bearer ${user.accessToken}`,
        'Content-Type': 'application/json',
      },
      data: data,
    });

    res.json(response.data);
  } catch (error) {
    logger.error(`Spotify API 요청 중 오류: ${error.message}`);
    next(new InternalServerError('Spotify API 요청 중 오류가 발생했습니다.'));
  }
};