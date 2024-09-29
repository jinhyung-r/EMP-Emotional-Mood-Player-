import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleButtonClick } from '../utils/navigateHandlers';

import { backgroundStyle } from './images/backgroundStyle';
import sampleImage from './images/home-sample.png';

import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className='background-container' style={backgroundStyle}>
        <h1 className='home-title'>
          EMOTIONAL
          <br />
          MOOD PLAYER
        </h1>
        <button className='playlist-btn' onClick={() => handleButtonClick(navigate, '/')}>
          플레이리스트 생성하기
        </button>
      </div>
      <div className='black-background'>
        <div className='section-container'>
          <div className='section'>
            <div className='image-content'>
              <img src={sampleImage} alt='감정 기반 음악 이미지' />
            </div>
            <div className='text-content'>
              <h2>
                감정에 딱 맞는 음악,
                <br />
                맞춤형 플레이리스트
              </h2>
              <p>
                감정에 따른 맞춤형 플레이리스트로 당신의 하루를 채워보세요. 감정을 선택하고, 가사 분석 기술로 추천된 노래들로 구성된 나만의 플레이리스트를 만나보세요. 기분에 맞는 노래로 감정에
                공감하고, 새롭게 발견한 음악의 세계로 빠져들 수 있습니다.
              </p>
              {/* <button className="playlist-btn"
                      onClick={() => handleButtonClick(navigate, '/')}>플레이리스트 생성하기</button> */}
            </div>
          </div>

          <div className='section'>
            <div className='image-content'>
              <img src={sampleImage} alt='노래 가사 기반 음악 이미지' />
            </div>
            <div className='text-content'>
              <h2>
                노래 가사로 찾는 <br />
                나만의 플레이리스트
              </h2>
              <p>
                좋아하는 가사 스타일이나 특정 분위기의 노래를 자동으로 찾아주는 기능을 통해 당신의 취향을 저격할 음악들을 손쉽게 발견하세요. 노래 가사 유사도 분석으로 당신만의 음악 동반자를 찾아주는
                똑똑한 음악 추천 서비스입니다.
              </p>
              {/* <button className="playlist-btn"
                      onClick={() => handleButtonClick(navigate, '/')}>플레이리스트 생성하기</button> */}
            </div>
          </div>

          <div className='section'>
            <div className='image-content'>
              <img src={sampleImage} alt='감정 기반 음악 이미지' />
            </div>
            <div className='text-content'>
              <h2>음악의 감정, 연결의 시작</h2>
              <p>
                음악이 전달하는 감정으로 사람들을 연결하세요. 감정 기반 플레이리스트와 소셜 공유 기능을 통해, 당신의 음악 취향과 감정을 친구들과 나누고 소통할 수 있습니다. 좋아하는 음악을 공유하며
                새로운 연결을 만들어 보세요.
              </p>
              {/* <button className="playlist-btn"
                      onClick={() => handleButtonClick(navigate, '/')}>플레이리스트 생성하기</button> */}
            </div>
          </div>
          <div className='playlist-btn-container'>
            <button className='playlist-btn' onClick={() => handleButtonClick(navigate, '/')}>
              플레이리스트 생성하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
