import React from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userState } from '../../store/atoms';
import './Header.css';
import axiosInstance from '../../apis/axiosInstance';

const Header = ({ isHomeOrLogin }) => {
  const navigate = useNavigate();

  // Recoil state for user
  const [user, setUser] = useRecoilState(userState);

  // 로그인 상태 확인
  const isLoggedIn = user !== null;

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      // 서버에 로그아웃 요청 보내기
      await axiosInstance.post('/auth/logout');
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
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
                      <Link to='/mypage'>안녕하세요, {user.name}님</Link>
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
