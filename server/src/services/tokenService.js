import axios from 'axios';
import config from '../config/index.js';

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
    throw new Error('Unsupported provider');
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
    
    // 새로운 액세스 토큰과 리프레시 토큰(있는 경우)을 사용자 정보에 업데이트
    user.accessToken = access_token;
    if (refresh_token) {
      user.refreshToken = refresh_token;
    }

    // 여기서 데이터베이스의 사용자 정보도 업데이트해야 합니다.
    await user.save();

    return access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};