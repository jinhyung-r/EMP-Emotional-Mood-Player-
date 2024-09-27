import React, { useState, useEffect } from 'react';
import axiosInstance from '../../apis/axiosInstance';
import '../../styles/My.css';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { playlistId } = location.state || {}; // 상태에서 playlistId 가져오기
  const [playlists, setPlaylists] = useState([]);
  const [latestPlaylist, setLatestPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [untitledCount, setUntitledCount] = useState(0); // 제목없음 번호 추가

  const getRandomLightColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${Math.min(r + 100, 255)}, ${Math.min(g + 100, 255)}, ${Math.min(b + 100, 255)})`;
  };

  const getRandomGradient = () => {
    const color1 = getRandomLightColor();
    const color2 = getRandomLightColor();
    return `linear-gradient(to bottom, ${color1}, ${color2})`;
  };

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const requestUrl = `/myplaylist/${playlistId}`;
        console.log(`Sending GET request to: ${requestUrl}`); // 요청 경로 출력
        const response = await axiosInstance.get(requestUrl);

        console.log('API 응답:', response.data); // 응답 데이터 출력

        if (response.data && response.data.playlist) { // 단일 객체인지 확인
          const fetchedPlaylists = [{
            ...response.data.playlist,
            gradient: getRandomGradient(),
          }];

          setPlaylists(fetchedPlaylists);

          if (fetchedPlaylists.length > 0) {
            setLatestPlaylist(fetchedPlaylists[0]);
          }
        } else {
          throw new Error('No playlists found or invalid format');
        }
      } catch (err) {
        const errorMessage = err.message || 'Error loading playlists';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (playlistId) {
      fetchPlaylists();
    } else {
      console.error('playlistId is undefined');
    }
  }, [playlistId]);

  const handlePlaylistClick = (playlist) => {
    setLatestPlaylist(playlist);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % playlists.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + playlists.length) % playlists.length);
  };

  const handleSongPlay = (song) => {
    console.log(`Opening ${song.title} by ${song.artist} on Spotify`);
    window.open(song.spotifyLink, '_blank');
  };

  const handleEditPlaylist = () => {
    setNewPlaylistName(latestPlaylist.title);
    setShowEditPopup(true);
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm(`정말 "${latestPlaylist.title}"을(를) 삭제하시겠습니까?`)) {
      try {
        await axiosInstance.delete(`/myplaylist/${latestPlaylist.playlist_id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            playlistId: latestPlaylist.playlist_id,
          },
        });
        setPlaylists((prevPlaylists) => prevPlaylists.filter((p) => p.playlist_id !== latestPlaylist.playlist_id));
        setLatestPlaylist(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSaveEdit = async () => {
    let title = newPlaylistName.trim() || '제목 없음'; // 기본 제목 설정

    // 동일한 제목이 이미 존재하는 경우 번호 추가
    if (title.startsWith('제목 없음')) {
      setUntitledCount((prevCount) => prevCount + 1);
      title = `제목 없음 ${untitledCount + 1}`;
    }

    try {
      await axiosInstance.put(`/myplaylist/${latestPlaylist.playlist_id}`, {
        playlistId: latestPlaylist.playlist_id,
        newTitle: title,
      });

      setPlaylists((prev) => prev.map((playlist) => (playlist.playlist_id === latestPlaylist.playlist_id ? { ...playlist, title: title } : playlist)));
      setLatestPlaylist((prev) => ({ ...prev, title: title }));
      setNewPlaylistName(title); // Update the new name to reflect the saved title
    } catch (err) {
      console.error(err);
    } finally {
      setShowEditPopup(false);
    }
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
      <h3 className='latest-playlist-title'>{latestPlaylist ? `${latestPlaylist.user}'s 최신 플레이리스트` : '최신 플레이리스트'}</h3>

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
              key={playlist.playlist_id}
              className={`playlist-album ${latestPlaylist?.playlist_id === playlist.playlist_id ? 'active' : ''}`}
              onClick={() => handlePlaylistClick(playlist)}
              style={{
                background: playlist.gradient,
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
          &#8594;
        </button>
      </div>

      <div className='playlist-details'>
        <ul className='song-list'>
          {latestPlaylist?.tracks?.map((song, index) => (
            <li key={index} className='song-item'>
              {song.artist} - {song.title}
              <button className='play-button' onClick={() => handleSongPlay(song)}>
                노래 듣기
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className='playlist-buttons'>
        <button className='edit-playlist-button' onClick={handleEditPlaylist}>
          플레이 리스트 수정하기
        </button>
        <button className='delete-playlist-button' onClick={handleDeletePlaylist}>
          플레이 리스트 삭제하기
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
            <img src='/images/igstory.png' alt='인스타그램 스토리 공유' className='social-share-icon' />
            <img src='/images/igmsg.png' alt='인스타그램 메시지 공유' className='social-share-icon' />
            <img src='/images/whatsapp.png' alt='와츠앱 메시지 공유' className='social-share-icon' />
            <img src='/images/facebook.png' alt='페이스북 공유' className='social-share-icon' />
            <img src='/images/sms.png' alt='SMS 공유' className='social-share-icon' />
          </div>
        )}
      </div>

      {showEditPopup && (
        <div className='edit-popup'>
          <h2>플레이 리스트 이름 수정</h2>
          <input type='text' value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} />
          <button onClick={handleSaveEdit}>저장</button>
          <button onClick={() => setShowEditPopup(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default MyPage;
