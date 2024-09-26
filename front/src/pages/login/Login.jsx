import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { backgroundStyle } from '../images/backgroundStyle';
import './Login.css';
import axios from 'axios';
import { handleResponse } from '../../apis/responseHandler';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (provider) => {
    // 각각의 OAuth 제공자에 맞는 서버 엔드포인트로 리다이렉션
    window.location.href = `http://localhost:8888/auth/${provider}`;
  };

  useEffect(() => {
    const fetchAuthData = async () => {
      // URL에 'code' 파라미터가 있는 경우에만 처리
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const provider = window.location.pathname.includes('google') ? 'google' : 'spotify';

      if (code) {
        try {
          const response = await axios.get(`http://localhost:8888/auth/${provider}/callback`, {
            params: { code },
          });

          // handleResponse에서 성공 여부에 따라 sessionStorage에 사용자 정보를 저장
          const data = handleResponse(response.data);
          if (data.success) {
            sessionStorage.setItem('user', JSON.stringify(data.user));
            navigate('/create'); // 인증 성공 후 '/create'로 리다이렉트
          } else {
            console.error('Login failed:', data.message);
          }
        } catch (error) {
          console.error('Error processing login response:', error);
        }
      }
    };

    fetchAuthData();
  }, [navigate]);

  return (
    <div className="background-container" style={backgroundStyle}>
      <div className="login-form">
        <h1 className="login-title">LOGIN</h1>
        <div className="login-btns">
          <button className="login-btn" onClick={() => handleLogin('spotify')}>
            <img src="/images/spotify-logo.svg" alt="Spotify 로고" width="100" height="31" />
            <span>로그인</span>
          </button>
          <button className="login-btn" onClick={() => handleLogin('google')}>
            <img src="/images/google-logo.svg" alt="Google 로고" />
            <span className="google">oogle</span><span className="google-login"> 로그인</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
