import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import necessary components from react-router-dom
import React from 'react';
import Header from './components/common/Header';
import Home from './pages/Home';
import Login from './pages/account/Login';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Header /*isLoggedIn={isLoggedIn}*/ />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
