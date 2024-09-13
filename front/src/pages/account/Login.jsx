import React from 'react';
import { backgroundStyle } from '../images/backgroundStyle';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { loginState } from '../../store/atoms';
import './Login.css';

const Login = () => {
  const setIsLoggedIn = useSetRecoilState(loginState);
  const navigate = useNavigate();

  const handleLogin = (provider) => {
    if (provider === 'spotify') {
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
      const scope = 'user-read-private user-read-email';
      const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`;
      window.location.href = authUrl;
    } else if (provider === 'google') {
      // Add Google login logic here
    }
    setIsLoggedIn(true); // 로그인 상태 변경
    navigate('/create'); // 로그인 후 검사 선택 페이지로 이동
  };

  return (
    <div className="background-container" style={backgroundStyle}>
      <div className="login-form">
        <h1 className="login-title">LOGIN</h1>
        <div className="login-btns">
          <button className="login-btn" onClick={() => handleLogin('spotify')}>
            <img src="/images/spotify-logo.svg" alt="Spotify 로고" width="100" height="31" />
            <span>로그인하기</span>
          </button>
          <button className="login-btn" onClick={() => handleLogin('google')}>
            <img src="/images/google-logo.svg" alt="Google 로고" />
            <span className="google-login">Google   로그인하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
