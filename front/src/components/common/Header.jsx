import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isHomeOrLogin }) => {
  const navigate = useNavigate();

  // 세션 스토리지에서 사용자 정보 가져오기
  const user = JSON.parse(sessionStorage.getItem('user'));

  // 로그인 상태 확인
  const isLoggedIn = user !== null;

  return (
    <header id='header'>
      <div className='desktop-navbar'>
        <nav className='navbar'>
          <ul className='nav-links'>
            {isHomeOrLogin ? (
              <>
                <li>
                  <Link to='/emotion-playlist'>감정기반 플레이리스트</Link>
                </li>
                <li>
                  <Link to='/lyrics-playlist'>가사기반 플레이리스트</Link>
                </li>
                <li>
                  <Link to='/login'>로그인/회원가입</Link>
                </li>
              </>
            ) : (
              <>
                {isLoggedIn && (
                  <>
                    <li>
                      <p><Link to='/mypage'>안녕하세요, {user.name || user.display_name}</Link></p>
                    </li>
                    <li>
                      <a
                        onClick={() => {
                          sessionStorage.removeItem('user');
                          // '/'로 리다이렉션
                          navigate('/');
                        }}
                      >
                        로그아웃
                      </a>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
