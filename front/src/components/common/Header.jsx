import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isHomeOrLogin }) => {
  const navigate = useNavigate();

  // 세션 스토리지에서 사용자 정보 가져오기
  const user = JSON.parse(sessionStorage.getItem('user'));

  // 로그인 상태 확인
  const isLoggedIn = user !== null;

  // 로그아웃 처리 함수
  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/');
  };

  return (
    <header id='header'>
      <div className='desktop-navbar'>
        <nav className='navbar'>
          <ul className='nav-links'>
            {isHomeOrLogin ? (
              <li>
                <Link to='/login'>로그인/회원가입</Link>
              </li>
            ) : (
              isLoggedIn && (
                <>
                  <li>
                    <p>
                      <Link to='/mypage'>안녕하세요, {user.name || user.display_name}</Link>
                    </p>
                  </li>
                  <li>
                    <button className='logout-button' type='button' onClick={handleLogout}>
                      로그아웃
                    </button>
                  </li>
                </>
              )
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

Header.propTypes = {
  isHomeOrLogin: PropTypes.bool.isRequired,
};

export default Header;
