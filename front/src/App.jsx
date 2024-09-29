import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Wrapper from './components/common/Wrapper';
import Home from './pages/Home';
import Login from './pages/login/Login';
import Create from './pages/create/Create';
import Lyrics from './pages/create/lyrics/Lyrics';
import Emotions from './pages/create/emotions/Emotions';
import My from './pages/mypage/My';
import Playlist from './pages/playlist/Playlist';
import PlaylistTest from './pages/playlist/PlaylistTest';
import OAuthCallback from './components/OAuthCallback';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/create' element={<Create />} />
          <Route path='/lyrics-playlist' element={<Lyrics />} />
          <Route path='/emotion-playlist' element={<Emotions />} />
          <Route path='/mypage' element={<My />} />
          <Route path='/playlist' element={<Playlist />} />
          <Route path='/playlist-test' element={<PlaylistTest />} />
          <Route path='/auth/google/callback' element={<OAuthCallback />} />
          <Route path='/auth/spotify/callback' element={<OAuthCallback />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}

export default App;
