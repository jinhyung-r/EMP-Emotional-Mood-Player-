import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userState, accessTokenState, refreshTokenState } from '../store/atoms';
import axiosInstance from '../apis/axiosInstance';
import Message from './Message';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Recoil 상태 설정 훅
  const setUser = useSetRecoilState(userState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setRefreshToken = useSetRecoilState(refreshTokenState);

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
            // Recoil 상태에 사용자 정보와 액세스 토큰 저장
            setUser(response.data.user);
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);

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
  }, [navigate, location, setUser, setAccessToken, setRefreshToken]);

  return <Message message='인증 처리 중...' />;
};

export default OAuthCallback;
