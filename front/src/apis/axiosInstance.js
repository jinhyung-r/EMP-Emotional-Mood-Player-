import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post('/auth/refresh-token');
        if (response.status === 200) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
