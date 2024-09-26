import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        const response = await axios.get('http://localhost:8888/auth/google/callback', {
          params: { code },
        });

        // 응답 데이터에서 사용자 정보와 토큰을 세션스토리지에 저장
        sessionStorage.setItem('user', JSON.stringify(response.data.user));

        // 인증 성공 후 리다이렉트
        navigate('/create');
      } catch (error) {
        console.error('Error processing login response:', error);
        // 에러 시 로그인 페이지로 리다이렉트
        navigate('/login');
      }
    };

    fetchAuthData();
  }, [navigate]);

  return <div>Google Login Callback Processing...</div>;
};

export default GoogleCallback;
