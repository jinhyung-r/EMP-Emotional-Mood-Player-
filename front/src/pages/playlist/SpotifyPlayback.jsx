import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../apis/axiosInstance';

const SpotifyPlayback = ({ trackUri, isPlaying, setIsPlaying }) => {
  const [spotifyPlayer, setSpotifyPlayer] = useState(null); // 내부에서 관리
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
            setSpotifyPlayer(player); // 내부에서 player 상태 관리
          };
        } catch (error) {
          console.error('Error initializing Spotify SDK:', error);
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
          console.error('Error playing/pausing track:', error.response ? error.response.data : error);
        }
      };

      playTrack();
    }
  }, [trackUri, deviceId, isReady, accessToken, isPlaying]);

  return null;
};

export default SpotifyPlayback;
