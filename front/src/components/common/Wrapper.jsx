import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Wrapper = ({ children }) => {
  const location = useLocation();

  // 로그인 상태에 따라 메뉴 표시 결정
  const isHomeOrLogin = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      <Header isHomeOrLogin={isHomeOrLogin} /> {/* isHomeOrLogin prop 전달 */}
      {children} {/* 나머지 페이지 콘텐츠 */}
      {isHomeOrLogin && <Footer />} {/* 조건부로 푸터 렌더링 */}
    </>
  );
};

export default Wrapper;
