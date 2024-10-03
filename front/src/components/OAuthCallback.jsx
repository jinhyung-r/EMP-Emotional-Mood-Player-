import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../apis/axiosInstance';

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
            // 세션에 사용자 정보와 액세스 토큰 저장
            sessionStorage.setItem('user', JSON.stringify(response.data.user));
            // sessionStorage.setItem('accessToken', response.data.accessToken);
            // sessionStorage.setItem('refreshToken', response.data.refreshToken);

            // 플레이리스트가 있으면 /mypage로, 없으면 /create로 리다이렉트
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
