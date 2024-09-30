import React, { useState, useEffect } from 'react';
import '../../styles/Playlist.css';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../apis/axiosInstance';

// const dummyUserData = {
//   success: true,
//   user: {
//     id: 5,
//     email: 'edwardminlee@gmail.com',
//     provider: 'google',
//     name: 'Edward Min Lee',
//     createdAt: '2024-09-27T04:29:44.256Z',
//   },
//   playlists: {
//     playlistId: 1,
//     title: "'민형님 테스트'",
//     userId: 5,
//   },
//   message: '인증이 완료되었습니다.',
// };

// const dummyPlaylistData = {
//   playlist: {
//     playlistId: 3,
//     title: '플리플리',
//     userId: 1,
//     tracks: [
//       {
//         id: 2,
//         title: '그라데이션',
//         artist: '10CM',
//         albumArt: 'url',
//         genre: '장르',
//         playlistId: 3,
//         spotifyLink: 'https://open.spotify.com/track/775S83AMYbQc8SYteOktTL',
//       },
//       {
//         id: 7,
//         title: 'title',
//         artist: 'artist',
//         albumArt: 'art',
//         genre: 'genre',
//         playlistId: 3,
//         spotifyLink: 'url',
//       },
//       {
//         id: 8,
//         title: 'tt',
//         artist: 'at',
//         albumArt: 'art',
//         genre: 'genre',
//         playlistId: 3,
//         spotifyLink: 'url',
//       },
//       {
//         id: 9,
//         title: 'tt',
//         artist: 'att',
//         albumArt: 'att',
//         genre: 'att',
//         playlistId: 3,
//         spotifyLink: 'att',
//       },
//     ],
//   },
// };
const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [user, setUser] = useState(null);

  // 로그인한 유저의 정보 가져오기
  const getUserData = () => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    // 세션 스토리지에 사용자 정보가 없으면 더미 데이터 사용
    // sessionStorage.setItem('user', JSON.stringify(dummyUserData.user));
    // return dummyUserData.user;
  };

  useEffect(() => {
    const userData = getUserData();
    setUser(userData);
    const userId = userData.id;

    const fetchPlaylists = async () => {
      try {
        const response = await axiosInstance.get(`/myplaylist/${userId}`);
        const fetchedPlaylists = response.data.playlist ? [response.data.playlist] : [];
        setPlaylists(fetchedPlaylists);
        sessionStorage.setItem('userPlaylists', JSON.stringify(fetchedPlaylists));
      } catch (err) {
        console.error('Error fetching playlists:', err);
        // 에러 발생 시 더미 데이터 사용
        // const dummyPlaylists = [dummyPlaylistData.playlist];
        // setPlaylists(dummyPlaylists);
        // sessionStorage.setItem('userPlaylists', JSON.stringify(dummyPlaylists));
      } finally {
        setLoading(false);
      }
    };

    const storedPlaylists = sessionStorage.getItem('userPlaylists');
    if (storedPlaylists) {
      setPlaylists(JSON.parse(storedPlaylists));
      setLoading(false);
    } else {
      fetchPlaylists();
    }
  }, []);

  const handleSongPlay = (song) => {
    console.log(`Opening ${song.title} by ${song.artist} on Spotify`);
    window.open(song.spotifyLink, '_blank');
  };

  const handleCreatePlaylist = () => {
    navigate('/create');
  };

  const handleSavePlaylistName = () => {
    const title = playlistName.trim() || '제목 없음';

    const updatedPlaylists = playlists.map((playlist) => (playlist.playlistId === selectedPlaylistId ? { ...playlist, title: title } : playlist));
    setPlaylists(updatedPlaylists);
    sessionStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
    setShowSavePopup(false);
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('정말로 플레이리스트를 삭제하시겠습니까?')) {
      const updatedPlaylists = playlists.filter((playlist) => playlist.playlistId !== playlistId);
      setPlaylists(updatedPlaylists);
      sessionStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
      alert('플레이리스트가 삭제되었습니다.');
    }
  };

  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
  };

  const handleSavePopupClose = () => {
    setShowSavePopup(false);
  };

  const handleEditPlaylist = (playlistId) => {
    setSelectedPlaylistId(playlistId);
    const playlist = playlists.find((p) => p.playlistId === playlistId);
    setPlaylistName(playlist ? playlist.title : '');
    setShowSavePopup(true);
  };

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading playlists: {error}</div>;

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
                {playlist.tracks.map((song) => (
                  <li key={song.id} className='song-item'>
                    <span className='artist-title'>
                      {song.artist} - {song.title}
                    </span>
                    <button className='play-button' onClick={() => handleSongPlay(song)}>
                      노래 듣기
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
        <p>플레이리스트가 없습니다. 새 플레이리스트를 만들어보세요!</p>
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
    </div>
  );
};

export default Playlist;
