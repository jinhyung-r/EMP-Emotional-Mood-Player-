import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import Header from './Header';
import Footer from './Footer';
import { userState } from '../../store/atoms';
import { getUsers } from '../../apis/userApi';

const Wrapper = ({ children }) => {
  const location = useLocation();
  const [, setUser] = useRecoilState(userState); // Only setUser is used

  // Fetch user info on component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUsers();
        setUser(userInfo);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, [setUser]);

  // 로그인 상태에 따라 메뉴 표시 결정
  const isHomeOrLogin = location.pathname === '/' || location.pathname === '/login';
  const isHome = location.pathname === '/';

  return (
    <>
      <Header isHomeOrLogin={isHome} /> {/* isHomeOrLogin prop 전달 */}
      {children} {/* 나머지 페이지 콘텐츠 */}
      {isHomeOrLogin && <Footer />} {/* 조건부로 푸터 렌더링 */}
    </>
  );
};

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Wrapper;
