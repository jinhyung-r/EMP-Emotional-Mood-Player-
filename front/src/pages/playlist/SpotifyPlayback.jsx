import React, { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../apis/axiosInstance';

import { PauseIcon } from './icons/PauseIcon';
import { PlayIcon } from './icons/PlayIcon';

const SpotifyPlayback = ({ trackUri }) => {
  const [player, setPlayer] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [isSpotifyUser, setIsSpotifyUser] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const initializeSpotifySDK = async () => {
      try {
        const tokenResponse = await axiosInstance.get('/auth/spotify/token');
        const token = tokenResponse.data.accessToken;

        if (!token) {
          console.error('Access token not found');
          return;
        }

        setAccessToken(token);
        setIsSpotifyUser(true);

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

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
      } catch (error) {
        console.error('Error initializing Spotify SDK:', error);
      }
    };

    initializeSpotifySDK();
  }, []);

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
      setIsPlaying(!isPlaying);
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
