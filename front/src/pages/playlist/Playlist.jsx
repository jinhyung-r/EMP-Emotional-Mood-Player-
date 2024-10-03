import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../apis/axiosInstance';
import SpotifyPlayback from './SpotifyPlayback';

import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

import '../../styles/Playlist.css';

const Playlist = () => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [currentTrackUri, setCurrentTrackUri] = useState(null); // 현재 재생 중인 트랙 URI
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // 로그인한 유저의 정보 가져오기
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');

  useEffect(() => {
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
      } catch (error) {
        console.error('Error fetching playlist:', error);
        alert(error.response?.data?.message || '플레이리스트를 불러오는 중 오류가 발생했습니다.');
      }
    };

    fetchData();
  }, [user]);

  // 트랙 선택 핸들러
  const handleTrackSelection = (track) => {
    if (currentTrackUri === track.spotify_id) {
      setIsPlaying((prev) => !prev); // 현재 선택된 트랙이 재생 중이면 재생 상태 토글
    } else {
      setCurrentTrackUri(track.spotify_id); // 다른 트랙을 선택하면 그 트랙으로 재생
      setIsPlaying(true); // 새 트랙 선택 시 재생 상태로 설정
    }
  };

  const handleCreatePlaylist = () => {
    navigate('/create');
  };

  const handleSavePlaylistName = async () => {
    try {
      const response = await axiosInstance.put(`/myplaylist/${selectedPlaylistId}`, {
        newTitle: playlistName,
      });

      if (response.status === 200) {
        const updatedPlaylists = playlists.map((playlist) => (playlist.playlistId === selectedPlaylistId ? { ...playlist, title: playlistName } : playlist));
        setPlaylists(updatedPlaylists);
        sessionStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
        setShowSavePopup(false);
        alert('플레이리스트 제목이 성공적으로 수정되었습니다.');
      } else {
        alert('플레이리스트 제목 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating playlist title:', error);
      alert(error.response?.data?.message || '플레이리스트 제목 수정 중 오류가 발생했습니다.');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    const confirmDelete = window.confirm('정말로 플레이리스트를 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        const response = await axiosInstance.delete(`/myplaylist/${playlistId}`);

        if (response.status === 200) {
          const updatedPlaylists = playlists.filter((playlist) => playlist.playlistId !== playlistId);
          setPlaylists(updatedPlaylists);
          sessionStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
          alert('플레이리스트가 성공적으로 삭제되었습니다.');
        } else {
          alert('플레이리스트 삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Error deleting playlist:', error);
        alert(error.response?.data?.message || '플레이리스트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSavePopupClose = () => {
    setShowSavePopup(false);
  };

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const handleEditPlaylist = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    setShowSavePopup(true);
  };

  return (
    <div className='playlist-page'>
      <h1 className='playlist-page-title'>PLAYLIST</h1>
      <h3 className='recommended-playlist-title'>{`${user.name || user.display_name}'s`} 추천 플레이리스트</h3>
      {playlists.length > 0 ? (
        <div className='playlist-container'>
          {playlists.map((playlist) => (
            <div key={playlist.playlistId} className='playlist-block'>
              <h3 className='playlist-title'>{playlist.title}</h3>
              <ul className='song-list'>
                {playlist.tracks.map((track, index) => (
                  <li key={index} className='song-item'>
                    <span className='artist-title'>
                      {track.artist} - {track.title}
                    </span>
                    <button className='play-button' onClick={() => handleTrackSelection(track)}>
                      {currentTrackUri === track.spotify_id && isPlaying ? <PauseIcon /> : <PlayIcon />}
                    </button>
                  </li>
                ))}
              </ul>
              <div className='playlist-buttons'>
                <button className='edit-button' onClick={() => handleEditPlaylist(playlist.playlistId)}>
                  이름 수정
                </button>
                <button className='delete-button' onClick={() => handleDeletePlaylist(playlist.playlistId)}>
                  삭제
                </button>
              </div>
              <div className='social-share'>
                <img className='social-share-button' src='/images/share.png' alt='공유하기' onClick={handleShareClick} />
                {showShareOptions && (
                  <div className='share-options-popup'>
                    <div className='share-titles'>
                      <h3 className='share-popup-title'>플레이 리스트 공유하기</h3>
                      <h2 className='share-playlist-title'>{playlist.title || '제목 없음'}</h2>
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
            </div>
          ))}
        </div>
      ) : (
        <p className='playlist-guide'>플레이리스트가 없습니다. 새 플레이리스트를 만들어보세요!</p>
      )}

      {showSavePopup && (
        <div className='save-playlist-popup'>
          <h2 className='save-playlist-title'>
            플레이리스트에 <br />
            이름을 추가하세요
          </h2>
          <input type='text' value={playlistName} onChange={handleNameChange} placeholder='플레이리스트 이름' className='playlist-name-input' />
          <div className='save-playlist-buttons'>
            <button className='cancel-playlist-button' onClick={handleSavePopupClose}>
              취소
            </button>
            <button className='save-playlist-button' onClick={handleSavePlaylistName}>
              저장하기
            </button>
          </div>
        </div>
      )}
      <button onClick={handleCreatePlaylist} className='create-playlist-button'>
        새 플레이리스트 만들기
      </button>

      {currentTrackUri && <SpotifyPlayback trackUri={`spotify:track:${currentTrackUri}`} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
    </div>
  );
};

export default Playlist;
