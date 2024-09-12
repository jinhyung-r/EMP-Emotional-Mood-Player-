import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const HeaderWrapper = ({ children }) => {
  const location = useLocation();
  
  // 홈 화면 또는 로그인 페이지에서만 헤더&푸터 표시
  const showCommon = location.pathname === '/' || location.pathname === '/login';

  return (
    <>
      {showCommon && <Header />} {/* 조건부로 렌더링 */}
      {children} {/* 나머지 페이지 콘텐츠 */}
      {showCommon && <Footer />} 
    </>
  );
};

export default HeaderWrapper;
