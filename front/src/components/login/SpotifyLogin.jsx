import React from 'react';

const client_id = '498a3758bca046acb925a22f8018bd03'; // 스포티파이 대시보드에서 복사한 클라이언트 ID
const redirect_uri = 'http://localhost:3000/auth/spotify'; // 스포티파이에서 설정한 리디렉션 URI
const auth_endpoint = 'https://accounts.spotify.com/authorize';
const response_type = 'token';

const SpotifyLogin = () => {
  const handleLogin = () => {
    const authUrl = `${auth_endpoint}?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=${response_type}&scope=user-read-private user-read-email`;
    window.location.href = authUrl;
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with Spotify</button>
    </div>
  );
};

export default SpotifyLogin;