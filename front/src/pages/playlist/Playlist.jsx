import React, { useState, useEffect } from 'react';
import '../../styles/Playlist.css';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import axiosInstance from '../../apis/axiosInstance';
import { getUsers } from '../../apis/userApi';
import { userState } from '../../store/atoms';
import SpotifyPlayback from './SpotifyPlayback';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isPlaylistSaved, setIsPlaylistSaved] = useState(false);
  const [untitledCount, setUntitledCount] = useState(0);

  const [currentTrackUri, setCurrentTrackUri] = useState(null); // Spotify에서 재생할 트랙 URI
  const [isPlaying, setIsPlaying] = useState(false); // 재생 상태 관리
  // const navigate = useNavigate();
  const location = useLocation(); // 라우팅 시 전달된 상태를 받아오기
  const [user, setUser] = useRecoilState(userState); // 사용자 상태 관리

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUsers();
        setUser(userData);

        // 라우팅 시 전달된 상태가 있는 경우 해당 데이터를 사용
        if (location.state && location.state.playlist) {
          setPlaylist(location.state.playlist);
          setPlaylistName(location.state.playlist.title || '');
        } else {
          // 전달된 상태가 없는 경우 API를 통해 플레이리스트 조회
          const playlistResponse = await axiosInstance.get(`/myplaylist/${userData.id}`);
          const playlistData = playlistResponse.data.playlist;
          setPlaylist(playlistData || null);
          setPlaylistName(playlistData?.title || '');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Error loading playlist');
        setLoading(false);
      }
    };

    fetchData();
    // 의존성 배열에서 user, setUser 제거, location.state도 변경이 필요하지 않으면 제거
  }, [location.state]);

  // 트랙 선택 시 Spotify 플레이어로 재생
  const handleSongPlay = (track) => {
    if (currentTrackUri === track.spotify_id) {
      setIsPlaying((prev) => !prev); // 현재 트랙이면 재생/일시정지 토글
    } else {
      setCurrentTrackUri(track.spotify_id); // 새 트랙 선택 시 URI 업데이트
      setIsPlaying(true); // 선택 시 재생
    }
  };

  const handleSavePlaylist = () => {
    setShowSavePopup(true);
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!playlistId) {
      console.error('삭제할 플레이리스트 ID가 없습니다.');
      return;
    }

    if (window.confirm('정말로 이 플레이리스트를 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/myplaylist/${playlistId}`);
        alert('플레이리스트가 성공적으로 삭제되었습니다.');
        // navigate('/'); // 삭제 후 홈으로 이동 (라우팅 활성화 시 주석 해제)
      } catch (err) {
        console.error('플레이리스트 삭제 중 오류:', err); // 실제 오류 메시지 확인
        alert('플레이리스트 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleSavePlaylistName = async () => {
    let title = playlistName.trim() || '제목 없음';

    // 제목이 '제목 없음'으로 시작하는 경우, 제목 번호를 증가시킵니다.
    if (title.startsWith('제목 없음')) {
      setUntitledCount((prevCount) => prevCount + 1);
      title = `제목 없음 ${untitledCount + 1}`;
    }

    const newPlaylistData = {
      newTitle: title,
    };

    try {
      // 플레이리스트 ID가 존재하는지 확인
      if (playlist?.playlistId) {
        await axiosInstance.put(`/myplaylist/${playlist.playlistId}`, newPlaylistData);
        setIsPlaylistSaved(true); // 저장 성공 표시
        setPlaylist({ ...playlist, title: title }); // 로컬 상태 업데이트
        setShowSavePopup(false); // 저장 팝업 닫기
        alert('플레이리스트 이름이 성공적으로 저장되었습니다.');
      } else {
        throw new Error('플레이리스트 ID를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('플레이리스트 저장 중 오류:', err);
      alert('플레이리스트 저장 중 오류가 발생했습니다.');
    }
  };

  const handleShareClick = () => {
    if (!isPlaylistSaved) {
      alert('플레이리스트를 먼저 저장해주세요.');
    } else {
      setShowShareOptions(!showShareOptions);
    }
  };

  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handlePopupClose = () => {
    setShowSavePopup(false);
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
          ))}
        </div>
        <ul className='song-list'>
          {playlist.tracks.map((track, index) => (
            <li key={index} className='song-item'>
              <span className='artist-title'>
                {track.artist} - {track.title}
              </span>
              <button className='play-button' onClick={() => handleSongPlay(track)}>
                {currentTrackUri === track.spotify_id && isPlaying ? <PauseIcon /> : <PlayIcon />}
              </button>
            </li>
          ))}
        </ul>
        <div className='playlist-buttons'>
          <button className='save-button' onClick={() => handleSavePlaylist()}>
            플레이리스트 저장하기
          </button>
          <button className='delete-button' onClick={() => handleDeletePlaylist(playlist.playlistId)}>
            플레이리스트 삭제하기
          </button>
        </div>
        <div className='social-share'>
          <img className='social-share-button' src='/images/share.png' alt='공유하기' onClick={handleShareClick} />
          {showShareOptions && (
            <div className='share-options-popup'>
              <div className='share-titles'>
                <h3 className='share-popup-title'>플레이리스트 공유하기</h3>
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
        {showSavePopup && (
          <div className='save-playlist-popup'>
            <h2 className='save-playlist-title'>
              플레이리스트에 <br />
              이름을 추가하세요
            </h2>
            <input type='text' value={playlistName} onChange={handleNameChange} placeholder='플레이리스트 이름' className='playlist-name-input' />
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

      {currentTrackUri && <SpotifyPlayback trackUri={`spotify:track:${currentTrackUri}`} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
    </div>
  );
};

export default Playlist;
