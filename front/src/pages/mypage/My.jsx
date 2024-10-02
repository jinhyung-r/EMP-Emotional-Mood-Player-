import React, { useState, useEffect } from 'react';
import axiosInstance from '../../apis/axiosInstance';
import '../../styles/My.css';
import { useNavigate /*, useParams */ } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [latestPlaylist, setLatestPlaylist] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // const getRandomLightColor = useCallback(() => {
  //   const r = Math.floor(Math.random() * 256);
  //   const g = Math.floor(Math.random() * 256);
  //   const b = Math.floor(Math.random() * 256);
  //   return `rgb(${Math.min(r + 100, 255)}, ${Math.min(g + 100, 255)}, ${Math.min(b + 100, 255)})`;
  // }, []);

  // const getRandomGradient = useCallback(() => {
  //   const color1 = getRandomLightColor();
  //   const color2 = getRandomLightColor();
  //   return `linear-gradient(to bottom, ${color1}, ${color2})`;
  // }, [getRandomLightColor]);
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect((user) => {
    const fetchData = async () => {
      try {
        const userId = user.id;

        if (!userId) {
          console.error('User ID not found');
          return;
        }

        const response = await axiosInstance.get(`/myplaylist/${userId}`);
        const playlistData = response.data.playlist;

        setPlaylists([playlistData] || []);
        setTracks(playlistData.tracks || []);
        setLatestPlaylist(playlistData);
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchData();
  }, []);

  const handlePlaylistClick = (playlist) => {
    setLatestPlaylist(playlist);
    setTracks(playlist.tracks || []);
    setCurrentIndex(playlists.indexOf(playlist));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % playlists.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + playlists.length) % playlists.length);
  };

  const handleDetailPlaylist = () => {
    navigate('/myplaylist');
  };

  const handleCreatePlaylist = () => {
    navigate('/create');
  };

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  return (
    <div className='mypage'>
      <h1 className='mypage-title'>MY PAGE</h1>
      <h3 className='latest-playlist-title'>{latestPlaylist ? `${user.name}'s 최신 플레이리스트` : '최신 플레이리스트'}</h3>
      <div className='playlist-slider-container'>
        <button className='arrow arrow-left' onClick={handlePrev}>
          &#8592;
        </button>
        <div
          className='playlist-slider'
          style={{
            display: 'flex',
            transition: 'transform 0.3s ease',
            overflow: 'hidden',
          }}
        >
          {playlists.map((playlist, index) => (
            <div
              key={playlists.playlistId}
              className={`playlist-album ${latestPlaylist?.playlistId === playlists.playlistId ? 'active' : ''}`}
              onClick={() => handlePlaylistClick(playlist)}
              style={{
                // background: playlist.gradient,
                minWidth: '200px',
                height: '200px',
                marginRight: '20px',
                transform: `translateX(${-currentIndex * (200 + 20)}px)`,
              }}
            >
              <div className='album-cover'>
                <span className='album-order'>{index + 1}</span>
              </div>
              <p className='album-title'>{playlists.title}</p>
            </div>
          ))}
        </div>
        <button className='arrow arrow-right' onClick={handleNext}>
          &#8594;
        </button>
      </div>

      <div className='playlist-details'>
        <ul className='song-list'>
          {tracks.map((tracks, index) => (
            <li key={index} className='song-item'>
              {tracks.artist} - {tracks.title}
            </li>
          ))}
        </ul>
      </div>

      <div className='playlist-buttons'>
        <button className='edit-playlist-button' onClick={handleDetailPlaylist}>
          플레이 리스트 자세히 보기
        </button>
        <button className='create-playlist-button' onClick={handleCreatePlaylist}>
          새로운 리스트 생성하기
        </button>
      </div>
      <div className='social-share'>
        <img className='social-share-button' src='/images/share.png' alt='공유하기' onClick={handleShareClick} />
        {showShareOptions && (
          <div className='share-options-popup'>
            <div className='share-titles'>
              <h3 className='share-popup-title'>플레이 리스트 공유하기</h3>
              <h2 className='share-playlist-title'>{latestPlaylist?.title || '제목 없음'}</h2>
            </div>
            <img src='/images/linkshare.png' alt='링크 복사' className='social-share-icon' />
            <img src='/images/kakao.png' alt='카카오톡 공유' className='social-share-icon' />
            <img src='/images/igstory.png' alt='인스타그램 스토리' className='social-share-icon' />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPage;
