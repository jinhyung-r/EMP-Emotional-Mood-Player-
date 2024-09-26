import React, { useState, useEffect } from 'react';
import '../../styles/Playlist.css';
import { useNavigate, useParams } from 'react-router-dom';
//import axiosInstance from '../apis/axiosInstance';

const Playlist = () => {
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { playlistId } = useParams();

  const [shareLink, setShareLink] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isPlaylistSaved, setIsPlaylistSaved] = useState(false);
  const [untitledCount, setUntitledCount] = useState(0); // 제목없음 번호 추가

  // 더미 데이터
  const dummyPlaylist = {
    userId: 1,
    tracks: [
      {
        artist: '아이유',
        title: '밤편지',
        albumArt: 'https://image.bugsm.co.kr/album/images/200/200890/20089092.jpg?version=20220301014959.0',
        spotifyLink: 'https://open.spotify.com/track/1Bb6jVrsg8cXxMCBxIWJUn',
      },
      {
        artist: '백예린',
        title: '그건 아마 우리의 잘못은 아닐 거야',
        albumArt: 'https://image.bugsm.co.kr/album/images/200/202383/20238312.jpg?version=20201216092743.0',
        spotifyLink: 'https://open.spotify.com/track/0wnSAKtD7n2Z5uOZcu0Obr',
      },
      {
        artist: 'AKMU',
        title: '어떻게 이별까지 사랑하겠어, 널 사랑하는 거지',
        albumArt: 'https://image.bugsm.co.kr/album/images/200/202788/20278851.jpg?version=20210727012601.0',
        spotifyLink: 'https://open.spotify.com/track/0hqj5JBnFt1BHEz2UCFwrl',
      },
      {
        artist: '잔나비',
        title: '주저하는 연인들을 위해',
        albumArt: 'https://image.bugsm.co.kr/album/images/200/202371/20237198.jpg?version=20210422183751.0',
        spotifyLink: 'https://open.spotify.com/track/5BqwC9kOBbqYkzdOKeXFFk',
      },
      {
        artist: '헤이즈',
        title: '비도 오고 그래서',
        albumArt: 'https://image.bugsm.co.kr/album/images/200/201049/20104917.jpg?version=20231026053140.0',
        spotifyLink: 'https://open.spotify.com/track/6FZAc2XaVYc8G8jaDnBshv',
      },
    ],
  };

  useEffect(() => {
    // Commenting out the API call for now
    // const accessToken = sessionStorage.getItem('access_token');

    // if (!accessToken) {
    //   setError('No access token found');
    //   setLoading(false);
    //   return;
    // }

    // axiosInstance
    //   .get(`/playlists/${playlistId}`, {
    //     headers: {
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   })
    //   .then((response) => {
    //     setPlaylist(response.data);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     setError(err.message || 'Error loading playlist');
    //     setLoading(false);
    //   });

    //더미 사용중
    setPlaylist(dummyPlaylist);
    setLoading(false);
  }, [playlistId]);

  const handleSongPlay = (song) => {
    console.log(`Opening ${song.title} by ${song.artist} on Spotify`);
    window.open(song.spotifyLink, '_blank');
  };

  const handleCreatePlaylist = () => {
    navigate('/create');
  };

  const handleSavePlaylistName = () => {
    let title = playlistName.trim() || '제목 없음'; // 기본 제목 설정

    // 동일한 제목이 이미 존재하는 경우 번호 추가
    if (title.startsWith('제목 없음')) {
      setUntitledCount((prevCount) => prevCount + 1);
      title = `제목 없음 ${untitledCount + 1}`;
    }

    const newPlaylistData = {
      playlistId,
      newTitle: title,
    };

    // axios 신규 플레이리스트 저장
    // axiosInstance
    //   .post('/playlists', newPlaylistData) // api 경로 확인하기
    //   .then((response) => {
    //     console.log('저장된 내용:', response.data);
    //     setIsPlaylistSaved(true);
    //     setShowSavePopup(false);
    //   })
    //   .catch((err) => {
    //     console.error('Error saving playlist:', err);
    //     alert('플레이 리스트 저장 중 오류가 발생했습니다.');
    //   });

    console.log('더미 save:', newPlaylistData);
    setIsPlaylistSaved(true);
    setShowSavePopup(false);
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

  const handleSavePopupClose = () => {
    setShowSavePopup(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading playlist: {error}</div>;

  return (
    <div className='playlist-page'>
      {playlist && (
        <div className='playlist-container'>
          <h1 className='playlist-page-title'>PLAYLIST</h1>
          <h3 className='recommended-playlist-title'>{playlist.userId}'s 추천 플레이리스트</h3>
          <div className='album-cover-row'>
            {playlist.tracks.map((song, index) => (
              <img key={index} src={song.albumArt} alt={song.title} className='album-cover' />
            ))}
          </div>
          <ul className='song-list'>
            {playlist.tracks.map((song, index) => (
              <li key={index} className='song-item'>
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
            <button className='create-button' onClick={handleCreatePlaylist}>
              새로운 리스트 생성하기
            </button>
            <button className='save-button' onClick={() => setShowSavePopup(true)}>
              플레이 리스트 저장하기
            </button>
          </div>
          <div className='social-share'>
            <img className='social-share-button' src='/images/share.png' alt='공유하기' onClick={handleShareClick} />
            {showShareOptions && (
              <div className='share-options-popup'>
                <div className='share-titles'>
                  <h3 className='share-popup-title'>플레이 리스트 공유하기</h3>
                  <h2 className='share-playlist-title'>{playlistName || '제목 없음'}</h2>
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
            <div className='save-popup'>
              <h2>플레이 리스트 제목 입력</h2>
              <input type='text' value={playlistName} onChange={handleNameChange} />
              <button onClick={handleSavePlaylistName}>저장</button>
              <button onClick={handleSavePopupClose}>취소</button>
            </div>
          )}
          {isPlaylistSaved && <div className='saved-message'>플레이 리스트가 저장되었습니다!</div>}
        </div>
      )}
    </div>
  );
};

export default Playlist;
