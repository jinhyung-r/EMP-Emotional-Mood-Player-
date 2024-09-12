import React from 'react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { loginState } from '../../store/atoms';

function Create() {
  const isLoggedIn = useRecoilValue(loginState);

  return (
    <div>
      <h1>테스트를 선택하세요</h1>
      <Link to="/lyrics"><button>가사에 맞는 플레이리스트 찾기</button></Link>
      <Link to="/emotions"><button>감정에 맞는 플레이리스트 찾기</button></Link>
      
      {/* {isLoggedIn && <Link to="/mypage"><button>마이페이지</button></Link>} */}
    </div>
  );
}

export default Create;
