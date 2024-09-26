import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { accessTokenState, refreshTokenState } from '../store/atoms';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  
  // Recoil 상태를 업데이트하는 함수
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      // Recoil 상태에 토큰 저장
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      
      // 수집 페이지로 리다이렉션
      navigate('/create');
    }
  }, [setAccessToken, setRefreshToken, navigate]);

  return <div>Spotify 로그인 중...</div>;
};

export default SpotifyCallback;
