import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../apis/axiosInstance';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SpotifyPlayback = ({ trackUri, isPlaying }) => {
  const [spotifyPlayer, setSpotifyPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (!spotifyPlayer) {
      const initializeSpotifySDK = async () => {
        try {
          const tokenResponse = await axiosInstance.get('/auth/spotify/token');
          const token = tokenResponse.data.accessToken;

          if (!token) {
            console.error('Access token not found');
            return;
          }

          setAccessToken(token);

          const script = document.createElement('script');
          script.src = 'https://sdk.scdn.co/spotify-player.js';
          script.async = true;
          document.body.appendChild(script);

          window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
              name: 'My Spotify Player',
              getOAuthToken: (cb) => cb(token),
              volume: 0.5,
            });

            player.addListener('ready', ({ device_id }) => {
              console.log('Player ready with Device ID:', device_id);
              setDeviceId(device_id);
              setIsReady(true);
            });

            player.addListener('not_ready', ({ device_id }) => {
              console.log('Player is not ready with Device ID:', device_id);
            });

            player.connect();
            setSpotifyPlayer(player);
          };
        } catch (error) {
          if (error.response && error.response.data.message === '인증되지 않았거나 Spotify 사용자가 아닙니다.') {
            toast.error('노래 재생 기능은 스포티파이 프리미엄 가입자만 이용 가능합니다.', {
              position: 'top-center',
              autoClose: 10000,
            });
          } else {
            console.error('Error initializing Spotify SDK:', error);
          }
        }
      };

      initializeSpotifySDK();
    }
  }, [spotifyPlayer]);

  useEffect(() => {
    if (trackUri && deviceId && isReady) {
      const playTrack = async () => {
        try {
          if (isPlaying) {
            await axios.put(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, { uris: [trackUri] }, { headers: { Authorization: `Bearer ${accessToken}` } });
            console.log('Started playback');
          } else {
            await spotifyPlayer.pause();
            console.log('Paused playback');
          }
        } catch (error) {
          toast.error('노래 재생 기능은 스포티파이 프리미엄 가입자만 이용 가능합니다.', {
            position: 'top-center',
            autoClose: 10000,
          });
          console.error('Error playing/pausing track:', error.response ? error.response.data : error);
        }
      };

      playTrack();
    }
  }, [trackUri, deviceId, isReady, accessToken, isPlaying]);

  return null;
};

export default SpotifyPlayback;
