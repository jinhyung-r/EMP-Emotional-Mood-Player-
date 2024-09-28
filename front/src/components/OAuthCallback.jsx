import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8888',
  withCredentials: true,
});

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchAuthData = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const provider = location.pathname.includes('google') ? 'google' : 'spotify';

      if (code) {
        try {
          const response = await axiosInstance.get(`/auth/${provider}/callback`, {
            params: { code },
          });

          if (response.data.success) {
            sessionStorage.setItem('user', JSON.stringify(response.data.user));

            if (response.data.playlistId) {
              navigate('/mypage', { state: { playlistId: response.data.playlistId } });
            } else {
              navigate('/create');
            }
          } else {
            throw new Error(response.data.message || '인증에 실패했습니다.');
          }
        } catch (error) {
          console.error('로그인 응답 처리 중 오류:', error);
          navigate('/login', { state: { error: error.message } });
        }
      }
    };

    fetchAuthData();
  }, [navigate, location]);

  return <div>인증 처리 중...</div>;
};

export default OAuthCallback;
