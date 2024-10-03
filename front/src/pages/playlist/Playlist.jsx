import React, { useState, useEffect } from 'react';
import '../../styles/Playlist.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../apis/axiosInstance';
import SpotifyPlayback from './SpotifyPlayback';

import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

import '../../styles/Playlist.css';

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [currentTrackUri, setCurrentTrackUri] = useState(null); // 현재 재생 중인 트랙 URI
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const [showShareOptions, setShowShareOptions] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isPlaylistSaved, setIsPlaylistSaved] = useState(false);
  const [untitledCount, setUntitledCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axiosInstance.get('/user-info');
        const userData = userResponse.data;
        setUser(userData);

        const playlistResponse = await axiosInstance.get(`/myplaylist/${userData.id}`);
        const playlistData = playlistResponse.data.playlist;
        setPlaylist(playlistData || null);
        setPlaylistName(playlistData?.title || '');
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error loading playlist');
        setLoading(false);
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

  const handleSavePlaylist = () => {
    setShowSavePopup(true);
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('정말로 이 플레이리스트를 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/myplaylist/${playlistId}`);
        alert('플레이리스트가 성공적으로 삭제되었습니다.');
        navigate('/'); // 홈 페이지로 이동
      } catch (err) {
        console.error('Error deleting playlist:', err);
        alert('플레이리스트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSavePlaylistName = async () => {
    let title = playlistName.trim() || '제목 없음';

    if (title.startsWith('제목 없음')) {
      setUntitledCount((prevCount) => prevCount + 1);
      title = `제목 없음 ${untitledCount + 1}`;
    }

    const newPlaylistData = {
      newTitle: title,
    };

    try {
      const response = await axiosInstance.put(`/myplaylist/${playlist.playlistId}`, newPlaylistData);
      console.log('저장된 내용:', response.data);
      setIsPlaylistSaved(true);
      setShowSavePopup(false);
      setShowEditPopup(false);
      setPlaylist({ ...playlist, title: title });
      alert('플레이리스트 이름이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('Error saving playlist:', err);
      alert('플레이 리스트 저장 중 오류가 발생했습니다.');
    }
  };

  const handleShareClick = () => {
    if (!isPlaylistSaved) {
      alert('플레이 리스트를 먼저 저장해주세요.');
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handlePopupClose = () => {
    setShowSavePopup(false);
    setShowEditPopup(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading playlist: {error}</div>;
  if (!playlist) return <div>No playlist found.</div>;

  return (
    <div className='playlist-page'>
      <div className='playlist-container'>
        <h1 className='playlist-page-title'>PLAYLIST</h1>
        <h3 className='recommended-playlist-title'>{`${user?.name || user?.display_name}'s`} 추천 플레이리스트</h3>
        <h2 className='playlist-name'>{playlist.title}</h2>
        <div className='album-cover-row'>
          {playlist.tracks.map((track, index) => (
            <img key={index} src={track.albumArt} alt={track.title} className='album-cover' onError={(e) => (e.target.src = 'images/emptyalbumart.png')} />
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
        <ul className='song-list'>
          {playlist.tracks.map((track, index) => (
            <li key={index} className='song-item'>
              <span className='artist-title'>
                {track.artist} - {track.title}
              </span>
              <button className='play-button' onClick={() => handleSongPlay(track)}>
                노래 듣기
              </button>
            </li>
          ))}
        </ul>
        <div className='playlist-buttons'>
          <button className='save-button' onClick={() => handleSavePlaylist()}>
            플레이 리스트 저장하기
          </button>
          <button className='delete-button' onClick={() => handleDeletePlaylist(playlist.playlistId)}>
            플레이 리스트 삭제하기
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
        {(showSavePopup || showEditPopup) && (
          <div className='save-playlist-popup'>
            <h2 className='save-playlist-title'>
              플레이 리스트에 <br />
              이름을 {showEditPopup ? '수정' : '추가'}하세요
            </h2>
            <input type='text' value={playlistName} onChange={handleNameChange} placeholder='플레이 리스트 이름' className='playlist-name-input' />
            <div className='save-playlist-buttons'>
              <button className='cancel-playlist-button' onClick={handlePopupClose}>
                취소
              </button>
              <button className='save-playlist-button' onClick={handleSavePlaylistName}>
                저장하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    {currentTrackUri && <SpotifyPlayback trackUri={`spotify:track:${currentTrackUri}`} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
  );
};

export default Playlist;
