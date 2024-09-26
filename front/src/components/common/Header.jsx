// import React from 'react';
// import { slide as Menu } from 'react-burger-menu';
// import { Link } from 'react-router-dom';
// import './Header.css';

// const Header = ({ isLoggedIn }) => {
//   return (
//     <header>
//       <div className="desktop-navbar">
//         <nav className="navbar">
//           <ul className="nav-links">
//             <li><Link to="/emotion-playlist">감정기반 플레이리스트</Link></li>
//             <li><Link to="/lyrics-playlist">가사기반 플레이리스트</Link></li>
//             {isLoggedIn ? (
//               <>
//                 <li><Link to="/mypage">마이페이지</Link></li>
//                 <li><Link to="/logout">로그아웃</Link></li>
//               </>
//             ) : (
//               <>
//                 <li><Link to="/login">로그인</Link></li>
//                 <li><Link to="/signup">회원가입</Link></li>
//               </>
//             )}
//           </ul>
//         </nav>
//       </div>

//       <div className="mobile-navbar">
//         <Menu>
//           <Link to="/emotion-playlist">감정기반 플레이리스트</Link>
//           <Link to="/lyrics-playlist">가사기반 플레이리스트</Link>
//           {isLoggedIn ? (
//             <>
//               <Link to="/mypage">마이페이지</Link>
//               <Link to="/logout">로그아웃</Link>
//             </>
//           ) : (
//             <>
//               <Link to="/login">로그인</Link>
//               <Link to="/signup">회원가입</Link>
//             </>
//           )}
//         </Menu>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React from 'react';
// import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isHomeOrLogin }) => {
  const navigate = useNavigate();

  // 로컬 스토리지에서 사용자 정보 가져오기
  const user = JSON.parse(localStorage.getItem('user'));

  // 로그인 상태확인
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
                          localStorage.removeItem('user');
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

      {/* <div className='mobile-navbar'>
        <Menu>
          {isHomeOrLogin ? (
            <>
              <Link to='/emotion-playlist'>감정기반 플레이리스트</Link>
              <Link to='/lyrics-playlist'>가사기반 플레이리스트</Link>
              <Link to='/login'>로그인/회원가입</Link>
            </>
          ) : (
            <>
              {isLoggedIn && (
                <>
                  <div>안녕하세요, {user.name || user.display_name}</div>
                  <div
                    onClick={() => {
                      localStorage.removeItem('user');
                      navigate('/');
                    }}
                  >
                    로그아웃
                  </div>
                </>
              )}
            </>
          )}
        </Menu>
      </div> */}
    </header>
  );
};

export default Header;
