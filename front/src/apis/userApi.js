import axiosInstance from './axiosInstance';

export const getUsers = async () => {
    try {
        const response = await axiosInstance.get('');
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// 스포티파이 사용자 정보 요청
export const getSpotifyUser = async (token) => {
  try {
    // Authorization 헤더에 토큰 추가
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Spotify 사용자 정보 요청
    const response = await axiosInstance.get('https://api.spotify.com/v1/me');
    return response.data;
  } catch (error) {
    console.error('Error fetching Spotify user data:', error);
    throw error;
  }
};

// 구글 사용자 정보 요청
export const getGoogleUser = async (token) => {
  try {
    // Authorization 헤더에 토큰 추가
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Google 사용자 정보 요청
    const response = await axiosInstance.get('https://www.googleapis.com/oauth2/v1/userinfo?alt=json');
    return response.data;
  } catch (error) {
    console.error('Error fetching Google user data:', error);
    throw error;
  }
};

// export const loginWithProvider = async (provider) => {
//   try {
//     const response = await axiosInstance.get(`/auth/${provider}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error during login with provider:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };