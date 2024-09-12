import React from 'react';
import { Link } from 'react-router-dom';

function Lyrics() {
  return (
    <div>
      <h1>가사에 맞는 플레이리스트 찾기</h1>
      <Link to="/mypage"><button>마이페이지</button></Link>
    </div>
  );
}

export default Lyrics;
