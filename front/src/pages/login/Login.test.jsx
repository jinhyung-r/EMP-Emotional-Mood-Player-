import React from 'react';
import { backgroundStyle } from '../images/backgroundStyle';
import './Login.css';

const Login = () => {

  const handleLogin = (provider) => {
    if (provider === 'spotify') {
      const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;
      const SCOPE = 'user-read-private user-read-email';
      const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${SCOPE}&redirect_uri=${redirectUri}`;
      window.location.href = authUrl;
    } else if (provider === 'google') {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
      const redirectUri = process.env.REACT_APP_GOOGLE_REDIRECT_URI;
      const SCOPE = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${clientId}&scope=${SCOPE}&redirect_uri=${redirectUri}&include_granted_scopes=true`;
      window.location.href = authUrl;
    }
  };

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
}

export default Login;
