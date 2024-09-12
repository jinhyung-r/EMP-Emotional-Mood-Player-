import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'; // Import necessary components from react-router-dom
import React from 'react';
import Wrapper from './components/common/Wrapper';
import Home from './pages/Home';
import Login from './pages/account/Login';
import Create from './pages/playlist/Create';
import Lyrics from './pages/playlist/lyrics/Lyrics';
import Emotions from './pages/playlist/emotions/Emotions';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Wrapper>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path="/create" element={<Create />} />
          <Route path="/lyrics-playlist" element={<Lyrics />} />
          <Route path="/emotion-playlist" element={<Emotions />} />
        </Routes>
      </Wrapper>
    </Router>
  );
}

export default App;
