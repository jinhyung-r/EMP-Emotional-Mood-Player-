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
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header>
      <div className="desktop-navbar">
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/emotion-playlist">감정기반 플레이리스트</Link></li>
            <li><Link to="/lyrics-playlist">가사기반 플레이리스트</Link></li>
            <li><Link to="/login">로그인/회원가입</Link></li>
          </ul>
        </nav>
      </div>

      <div className="mobile-navbar">
        <Menu>
          <Link to="/emotion-playlist">감정기반 플레이리스트</Link>
          <Link to="/lyrics-playlist">가사기반 플레이리스트</Link>
          <Link to="/login">로그인/회원가입</Link>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
