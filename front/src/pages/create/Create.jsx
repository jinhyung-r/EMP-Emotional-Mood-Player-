import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// import { useRecoilValue } from 'recoil';
// import { loginState } from '../../store/atoms';
import '../../styles/Create.css';
import defaultProfile from '../images/default-profile.png';

function Create() {
  // const isLoggedIn = useRecoilValue(loginState);
  const location = useLocation();
  const user = location.state?.user;

  return (
    <div className='background-create'>
      {user && (
        <div className='user-info'>
          <h1>Welcome, {user.display_name}</h1>
          {/* <img src={user.images[0]?.url || '../images/default-profile.png'} alt='Profile' onError={(e) => (e.target.src = '../images/default-profile.png')} /> */}
          <img src={defaultProfile} alt='Profile'/>        
        </div>
      )}
      <h1 className='create-title'>CREATE</h1>
      <div className='create-btns'>
        <Link to='/lyrics-playlist'>
          <button className='lyrics'>가사에 맞는 플레이리스트 찾기</button>
        </Link>
        <Link to='/emotion-playlist'>
          <button className='emotions'>감정에 맞는 플레이리스트 찾기</button>
        </Link>
      </div>
    </div>
  );
}

export default Create;
