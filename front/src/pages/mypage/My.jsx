import React, { useState, useEffect, useCallback } from 'react';
// import axiosInstance from '../../apis/axiosInstance';
import '../../styles/My.css';
import { useNavigate /*, useParams */ } from 'react-router-dom';

const MyPage = () => {
  const navigate = useNavigate();
  // const { playlistId } = useParams();
  const [userName, setUserName] = useState('');
  const [playlists, setPlaylists] = useState([]);
  const [latestPlaylist, setLatestPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [untitledCount, setUntitledCount] = useState(0); // 제목없음 번호 추가

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
    const fetchPlaylists = async () => {
      // 서버 요청 대신 고정된 값 사용
      const user = JSON.parse(sessionStorage.getItem('user'));
      const name = user.name || user.display_name;
      setUserName(name); //임시값

      // 임시 데이터
      const dummyResponse = {
        playlist: [
          {
            playlist_id: 1,
            title: 'Playlist 1',
            tracks: [
              {
                title: '그라데이션',
                artist: '10CM',
                spotifyLink: 'https://open.spotify.com/track/775S83AMYbQc8SYteOktTL',
              },
              {
                title: '걘 아니야 Pt.2',
                artist: '페노메코(PENOMECO)',
                spotifyLink: 'https://open.spotify.com/track/6wDWM82A0rujxVjsxCgqV5',
              },
              {
                title: '바꿔',
                artist: '이정현',
                spotifyLink: 'https://open.spotify.com/track/3COMNgsSBF1Gs3TV2zlc0T',
              },
              {
                title: '함께 걷는 길 (Walking Together)',
                artist: 'Leon Ivins',
                spotifyLink: 'https://open.spotify.com/track/55IZ4lpqtCvYXEtOOIqY8K',
              },
              {
                title: 'Healer',
                artist: 'DAY6 (데이식스)',
                spotifyLink: 'https://open.spotify.com/track/7kC5Q1Ai6RSshkuFXCcsMG',
              },
            ],
          },
          {
            playlist_id: 2,
            title: 'Playlist 2',
            tracks: [
              {
                title: '마음',
                artist: '아이유(IU)',
                spotifyLink: 'https://open.spotify.com/track/6dGsBRuavumBs5BghcXF3D',
              },
              {
                title: '축하해 (Prod. By VAN.C)',
                artist: '오반(OVAN)',
                spotifyLink: 'https://open.spotify.com/track/0jsfgbqNlU9sXAtf1kg5V0',
              },
              {
                title: '라라라',
                artist: '이수영',
                spotifyLink: 'https://open.spotify.com/track/6Cpw0x7Ngn8p6sXCFG3rx0',
              },
              {
                title: 'For Youth',
                artist: '방탄소년단',
                spotifyLink: 'https://open.spotify.com/track/4JzCFEc3O2UEdjKzevvFH5',
              },
              {
                title: 'everyday we fight',
                artist: 'DAY6 (데이식스)',
                spotifyLink: 'https://open.spotify.com/track/4CimQqD7nmLNIEQFBwaoiJ',
              },
            ],
          },
          {
            playlist_id: 3,
            title: 'Playlist 3',
            tracks: [
              {
                title: 'Forever Young',
                artist: 'BLACKPINK',
                spotifyLink: 'https://open.spotify.com/track/6veFyjNycn6EaNCKhkPXUY',
              },
              {
                title: '챠우챠우 - 아무리 애를 쓰고 막아 보려 해도 너의 목소리가 들려',
                artist: '델리 스파이스(Deli Spice)',
                spotifyLink: 'https://open.spotify.com/track/nan',
              },
              {
                title: "검정색하트 (Feat. Leellamarz, BE'O)",
                artist: 'TOIL',
                spotifyLink: 'https://open.spotify.com/track/2odm919sRfQIhH2na8YSKK',
              },
              {
                title: 'Never Ending Story',
                artist: '부활',
                spotifyLink: 'https://open.spotify.com/track/0yamqkAFAmpdLNVcmJLSo8',
              },
              {
                title: '그러지 마 (feat. RM)',
                artist: '이이언(eAeon)',
                spotifyLink: 'https://open.spotify.com/track/6KE3Fs6LMzi4hJI3eFqyLC',
              },
            ],
          },
          {
            playlist_id: 4,
            title: 'Playlist 4',
            tracks: [
              {
                title: 'Destiny (나의 지구)',
                artist: '오마이걸(OH MY GIRL)',
                spotifyLink: 'https://open.spotify.com/track/5pbi3sFuWby4iHOTicGHke',
              },
              {
                title: 'Get A Guitar',
                artist: 'RIIZE',
                spotifyLink: 'https://open.spotify.com/track/3Dah48XTdzVtbIl4dUn6l4',
              },
              {
                title: 'Kemi',
                artist: 'Cold brew',
                spotifyLink: 'https://open.spotify.com/track/0eYRtetALk1U60bJ2N3458',
              },
              {
                title: '안녕',
                artist: '폴킴(Paul Kim)',
                spotifyLink: 'https://open.spotify.com/track/7sZwWzSeCtGYo5ZQcWRLlJ',
              },
              {
                title: '화려하지 않은 고백',
                artist: '규현 (KYUHYUN)',
                spotifyLink: 'https://open.spotify.com/track/584hTOO20B2WKK8PjPB1Gw',
              },
            ],
          },
          {
            playlist_id: 5,
            title: 'Playlist 5',
            tracks: [
              {
                title: 'You & Me',
                artist: '제니 (JENNIE)',
                spotifyLink: 'https://open.spotify.com/track/6gcuJpHu0Ey30D5WR76y98',
              },
              {
                title: 'View',
                artist: 'SHINee (샤이니)',
                spotifyLink: 'https://open.spotify.com/track/46E1ic6n099e76t5J1TbHn',
              },
              {
                title: '사이 (Feat. D2ear) (prod. Seo mary)',
                artist: 'NASON (나선)',
                spotifyLink: 'https://open.spotify.com/track/6zJrXwisdGWqcAu6B3wzxF',
              },
              {
                title: '첫 만남은 계획대로 되지 않아',
                artist: 'TWS (투어스)',
                spotifyLink: 'https://open.spotify.com/track/nan',
              },
              {
                title: 'Nomite',
                artist: '미스틱하트',
                spotifyLink: 'https://open.spotify.com/track/5m4YmqBmXSYIwGsFBdfrvb',
              },
            ],
          },
        ],
      };

      // 응답 데이터 사용
      const response = dummyResponse; // 실제 서버 호출 대신 임시 데이터 사용

      try {
        if (response.playlist) {
          const fetchedPlaylists = response.playlist.map((playlist) => ({
            ...playlist,
            gradient: getRandomGradient(),
          }));

          setPlaylists(fetchedPlaylists);
          setLatestPlaylist(fetchedPlaylists.length > 0 ? fetchedPlaylists[0] : null);
        } else {
          throw new Error('No playlists found');
        }
      } catch (err) {
        // const errorMessage = err.response?.data?.message || err.message || 'Error loading playlists';
        // setError(errorMessage);
        console.error(err); // 서버 측 요청 확인을 위해 로그 남기기
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [getRandomGradient]);

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
    setNewPlaylistName(latestPlaylist ? latestPlaylist.title : '제목 없음');
    setShowEditPopup(true);
  };

  const handleDeletePlaylist = async () => {
    if (window.confirm(`정말 "${latestPlaylist ? latestPlaylist.title : '제목 없음'}"을(를) 삭제하시겠습니까?`)) {
      // 삭제 요청을 서버에 보내는 부분 주석 처리
      // try {
      //   await axiosInstance.delete(`/myplaylist/${latestPlaylist.playlist_id}`);
      //   setPlaylists((prevPlaylists) => prevPlaylists.filter((p) => p.playlist_id !== latestPlaylist.playlist_id));
      //   setLatestPlaylist(null);
      // } catch (err) {
      //   console.error(err);
      // }
      console.log('Playlist deleted'); // 임시 출력
    }
  };

  const handleSaveEdit = async () => {
    let title = newPlaylistName.trim() || '제목 없음'; // 기본 제목 설정

    // 동일한 제목이 이미 존재하는 경우 번호 추가
    if (title.startsWith('제목 없음')) {
      setUntitledCount((prevCount) => prevCount + 1);
      title = `제목 없음 ${untitledCount + 1}`;
    }

    // 저장 요청을 서버에 보내는 부분 주석 처리
    // try {
    //   await axiosInstance.put(`/myplaylist/${latestPlaylist.playlist_id}`, { newTitle: title });
    //   setPlaylists((prev) => prev.map((playlist) => (playlist.playlist_id === latestPlaylist.playlist_id ? { ...playlist, title } : playlist)));
    //   setLatestPlaylist((prev) => ({ ...prev, title }));
    // } catch (err) {
    //   console.error(err);
    // }
    console.log(`Playlist title saved: ${title}`); // 임시 출력

    setShowEditPopup(false);
  };

  const handleCreatePlaylist = () => {
    navigate('/create');
  };

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error loading playlists: {error}</div>;

  return (
    <div className='mypage'>
      <h1 className='mypage-title'>MY PAGE</h1>
      <h3 className='latest-playlist-title'>{latestPlaylist ? `${userName}'s 최신 플레이리스트` : '최신 플레이리스트'}</h3>
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
            <img src='/images/igstory.png' alt='인스타그램 스토리' className='social-share-icon' />
          </div>
        )}
      </div>

      {showEditPopup && (
        <div className='edit-playlist-popup'>
          <h2>플레이 리스트 제목 수정하기</h2>
          <input type='text' value={newPlaylistName} onChange={(e) => setNewPlaylistName(e.target.value)} />
          <button onClick={handleSaveEdit}>저장하기</button>
          <button onClick={() => setShowEditPopup(false)}>취소하기</button>
        </div>
      )}
    </div>
  );
};

export default MyPage;
