import React from 'react';
import { useRecoilState } from 'recoil';
import { searchTermState } from '../../../store/atoms';
import axiosInstance from '../../../apis/axiosInstance';
import '../../../styles/Survey.css';

function Lyrics() {
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/lyrics-playlist', { searchTerm }); // 서버로 검색어 전송
      console.log('Server response:', response.data);
      // 플레이리스트 ID를 이용해 페이지 이동 처리
    } catch (error) {
      console.error('Error submitting lyrics:', error);
    }
  };

  return (
    <div className='background-survey'>
      <h1 className='survey-title'>SURVEY</h1>
      <p className='instruction'>좋아하는 가사를 입력해주세요.</p>
      <form className='lyrics-form' onSubmit={handleSubmit}>
        <input type='text' className='transparent-input' placeholder='가사를 입력하세요' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <button type='submit' className='submit-button'>
          플레이리스트 생성하기
        </button>
      </form>
    </div>
  );
}

export default Lyrics;
