import React from 'react';
import { useRecoilState } from 'recoil';
import { lyricsState } from '../../../store/atoms';
import '../../../styles/Survey.css'; //emotion,lyrics-playlist 공통 스타일

function Lyrics() {
  const [lyrics, setLyrics] = useRecoilState(lyricsState); // 입력된 가사를 상태로 관리
  const handleSubmit = (e) => {
    //axios 사용시 수정될 부분
    e.preventDefault();
    // 서버로 가사를 보낼 API 요청 처리
    console.log('Submitting lyrics:', lyrics);
  };

  return (
    <div className="background-survey">
      <h1 className="survey-title">SURVEY</h1>
      <p className="instruction">좋아하는 가사를 입력해주세요.</p>
      <form className="lyrics-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="transparent-input"
          placeholder="가사를 입력하세요"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
        />
        <button type="submit" className="submit-button">플레이리스트 생성하기</button>
      </form>
    </div>
  );
}

export default Lyrics;
