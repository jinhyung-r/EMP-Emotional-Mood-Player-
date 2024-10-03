import React, { useState, useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../apis/axiosInstance';
import { getUsers } from '../../apis/userApi';
import { userState } from '../../store/atoms';
import '../../styles/My.css';

const MyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [latestPlaylist, setLatestPlaylist] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [user, setUser] = useRecoilState(userState); // 사용자 상태 관리

  const getRandomLightColor = useCallback(() => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${Math.min(r + 100, 255)}, ${Math.min(g + 100, 255)}, ${Math.min(b + 100, 255)})`;
  }, []);

  const getRandomGradient = useCallback(() => {
    const color1 = getRandomLightColor();
    const color2 = getRandomLightColor();
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
  }, [getRandomLightColor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 정보 불러오기
        const userData = await getUsers();
        setUser(userData);

        // 사용자 ID로 플레이리스트 불러오기
        const playlistResponse = await axiosInstance.get(`/myplaylist/${userData.id}`);
        const playlistData = playlistResponse.data.playlist ? [playlistResponse.data.playlist] : [];

        if (playlistData.length > 0) {
          const fetchedPlaylists = playlistData.map((playlist) => ({
            ...playlist,
            gradient: getRandomGradient(),
          }));

          setPlaylists(fetchedPlaylists);
          setLatestPlaylist(fetchedPlaylists[0]);
          setTracks(fetchedPlaylists[0].tracks || []);
        } else {
          setPlaylists([]);
          setLatestPlaylist(null);
          setTracks([]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error loading playlist');
        setLoading(false);
      }
    };

    fetchData();
  }, [getRandomGradient, setUser]);

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
    navigate('/myplaylist', { state: { playlist: latestPlaylist } });
  };

  const handleCreatePlaylist = () => {
    navigate('/create');
  };

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading playlists: {error}</div>;

  return (
    <div className='mypage'>
      <h1 className='mypage-title'>MY PAGE</h1>
      {playlists.length > 0 ? (
        <>
          <h3 className='latest-playlist-title'>{`${user.name}'s 최신 플레이리스트`}</h3>
          <div className='playlist-slider-container'>
            <button className='arrow arrow-left' onClick={handlePrev}>
              ←
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
                  key={playlist.playlistId}
                  className={`playlist-album ${latestPlaylist?.playlistId === playlist.playlistId ? 'active' : ''}`}
                  onClick={() => handlePlaylistClick(playlist)}
                  style={{
                    minWidth: '200px',
                    height: '200px',
                    marginRight: '20px',
                    transform: `translateX(${-currentIndex * (200 + 20)}px)`,
                  }}
                >
                  <div className='album-cover'>
                    <span className='album-order'>{index + 1}</span>
                  </div>
                  <p className='album-title'>{playlist.title}</p>
                </div>
              ))}
            </div>
            <button className='arrow arrow-right' onClick={handleNext}>
              →
            </button>
          </div>

          <div className='playlist-details'>
            <ul className='song-list'>
              {tracks.map((track, index) => (
                <li key={index} className='song-item'>
                  {track.artist} - {track.title}
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
        </>
      ) : (
        <div>플레이리스트가 없습니다. 새로운 플레이리스트를 만들어보세요!</div>
      )}
    </div>
  );
};

export default MyPage;
