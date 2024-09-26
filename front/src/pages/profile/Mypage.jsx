import React from 'react';
import { useRecoilValue } from 'recoil';
import { userState, albumCommentsSelector } from '../../store/atoms';
import shareIcon from '../images/share.png';
import './Mypage.css';

const colors = ['#FF4AF8', '#00BFFC', '#FF006B', '#AE29FF', '#EAA800'];

const Mypage = () => {
  const user = useRecoilValue(userState);
  const albumComments = useRecoilValue(albumCommentsSelector);

  return (
    <div className="background-mypage">
      <div className="mypage-content">
        <h1 className="mypage-title">MY PAGE</h1>
        <p className="mypage-subtitle">{user.name || user.display_name}님의 최근 리스트</p>
        <div className="mypage-album-art-container">
          {albumComments.map((album, index) => (
            <div key={album.id} className="mypage-album-art">
              {album.image ? (
                <img
                  src={album.image}
                  alt={`Album Art ${album.id}`}
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = '';
                  }}
                />
              ) : (
                <div
                  className="mypage-album-placeholder"
                  style={{ backgroundColor: colors[index % colors.length] }}
                >
                  {index + 1}
                </div>
              )}
              <p className="mypage-album-comment">{album.comment}</p>
            </div>
          ))}
        </div>
        <div className="mypage-playlist-container">
          <ul className="mypage-playlist-list">
            {[1, 2, 3, 4, 5].map((item) => (
              <li key={item} className="mypage-playlist">
                <span className="playlist-item">Playlist Item {item}</span>
                <button className="playlist-button">노래듣기</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mypage-buttons">
          <button className="mypage-button">플레이 리스트 수정하기</button>
          <button className="mypage-button">플레이 리스트 삭제하기</button>
          <button className="mypage-button">새로운 리스트 생성하기</button>
        </div>
      </div>
      <div className="mypage-share-container">
        <button className="mypage-share-button">
          <img src={shareIcon} alt="공유하기" className="share-icon" />
        </button>
      </div>
    </div>
  );
};

export default Mypage;