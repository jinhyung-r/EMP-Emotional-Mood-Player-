import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Create.css';

function Create() {
  return (
    <div className='background-create'>
      <h1 className='create-title'>CREATE</h1>
      <div className='create-btns'>
        <Link to='/lyrics-playlist'>
          <button className='lyrics'>가사에 맞는 플레이리스트 찾기</button>
        </Link>
        <Link to='/emotion-playlist'>
          <button className='emotions'>감정에 맞는 플레이리스트 찾기</button>
        </Link>
      </div>
    </div>
  );
}

export default Create;
