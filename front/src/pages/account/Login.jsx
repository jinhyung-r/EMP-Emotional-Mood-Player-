import React from 'react';
import { backgroundStyle } from '../images/backgroundStyle';

import './Login.css';

const Login = () => {
  return (
    <div className="background-container" style={backgroundStyle}>
      <div className="login-form">
        <h1 className="login-title">LOGIN</h1>
          <div className="login-btns">
            <button className="login-btn">
                <img src="/images/spotify-logo.svg" alt="Spotify 로고" width="100" height="31" />
                <span>로그인하기</span>
            </button>
            <button className="login-btn">
                <img src="/images/google-logo.svg" alt="Google 로고" />
                <span className="google-login">oogle &nbsp; 로그인하기</span>
            </button>
          </div>
      </div>
    </div>
  );
}

export default Login;
