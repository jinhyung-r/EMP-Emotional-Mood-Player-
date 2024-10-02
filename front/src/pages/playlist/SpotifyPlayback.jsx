import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../apis/axiosInstance';

import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';

const SpotifyPlayback = ({ trackUri }) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [accessToken, setAccessToken] = useState(null); // 서버에서 받아온 accessToken
  const [isSpotifyUser, setIsSpotifyUser] = useState(false); // Spotify 사용자인지 여부
  const [isPremium, setIsPremium] = useState(false); // 프리미엄 여부 확인
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 추적

  // const trackUri = 'spotify:track:4e1aewX6ATPcdfQIqr7gqO'; // Spotify 트랙 URI

  // Spotify SDK 로드 함수
  const loadSpotifySDK = () => {
    if (!window.Spotify) {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  // Spotify 플레이어 초기화 함수
  const initializeSpotifyPlayer = (token) => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      const spotifyPlayer = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      spotifyPlayer.addListener('ready', ({ device_id }) => {
        console.log('Player ready with Device ID:', device_id);
        setDeviceId(device_id);
        setIsReady(true);
      });

      spotifyPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('Player is not ready with Device ID:', device_id);
      });

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    };
  };

  // 프리미엄 사용자 확인 함수
  const checkIfPremiumUser = async (token) => {
    try {
      const response = await axios.get('/api/spotify/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = response.data;
      if (userData.product === 'premium') {
        setIsPremium(true);
        console.log('User is a Premium user');
      } else {
        setIsPremium(false);
        console.log('User is not a Spotify Premium user');
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  // 엑세스 토큰 가져오기 및 플레이어 설정
  const fetchAccessTokenAndSetupPlayer = async () => {
    try {
      const tokenResponse = await axiosInstance.get('/auth/spotify/token');
      const token = tokenResponse.data.accessToken;

      if (!token) {
        console.error('Access token not found');
        return;
      }

      setAccessToken(token);
      setIsSpotifyUser(true);
      checkIfPremiumUser(token);

      // SDK 로드 확인 후 플레이어 초기화
      if (window.Spotify) {
        initializeSpotifyPlayer(token);
      } else {
        loadSpotifySDK();
        initializeSpotifyPlayer(token);
      }
    } catch (error) {
      console.error('Failed to retrieve access token:', error);
    }
  };

  useEffect(() => {
    fetchAccessTokenAndSetupPlayer();
  }, [trackUri]);

  // 재생 및 일시정지 처리 함수
  const handlePlayPause = async () => {
    if (!player || !deviceId) {
      console.error('Cannot play or pause song: player or deviceId is missing');
      return;
    }

    try {
      const playbackState = await player.getCurrentState();
      if (playbackState && !playbackState.paused) {
        await player.pause();
        console.log('Paused playback');
      } else if (playbackState && playbackState.paused) {
        await player.resume();
        console.log('Resumed playback');
      } else {
        await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, { uris: [trackUri] }, { headers: { Authorization: `Bearer ${accessToken}` } });
        console.log('Started playback');
      }
      setIsPlaying(!isPlaying); // 재생 상태 업데이트
    } catch (error) {
      console.error('Error handling play/pause:', error.response ? error.response.data : error);
    }
  };

  return (
    <div>
      {isReady && isSpotifyUser && isPremium && (
        <button className='play-button' onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
      )}
    </div>
  );
};

export default SpotifyPlayback;
