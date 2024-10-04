import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, searchTermState } from '../../../store/atoms';
import axiosInstance from '../../../apis/axiosInstance';
import '../../../styles/Survey.css';

function Lyrics() {
  const [searchTerm, setSearchTerm] = useRecoilState(searchTermState);
  const [preferLatest, setPreferLatest] = useState(true); // 기본값 true
  const [playlistTitle, setPlaylistTitle] = useState(''); // 기본값 "제목 없음"
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const user = useRecoilValue(userState); // 사용자 상태 읽기
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    const postData = {
      searchTerm,
      prefer_latest: preferLatest,
      userId: user?.id, // userId를 userState에서 가져옴
      title: playlistTitle || '제목 없음', // 빈 문자열일 경우 "제목 없음" 설정
    };

    try {
      const response = await axiosInstance.post('/lyrics-playlist', postData);
      navigate('/myplaylist', { state: { playlist: response.data } });
    } catch (error) {
      console.error('Error submitting lyrics:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='background-survey'>
      <h1 className='survey-title'>SURVEY</h1>
      <p className='instruction'>좋아하는 가사를 입력해주세요.</p>
      <form className='lyrics-form' onSubmit={handleSubmit}>
        <input type='text' className='transparent-input' placeholder='가사를 입력하세요' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <button type='button' className='submit-button' onClick={() => setIsModalOpen(true)}>
          옵션 설정
        </button>

        <button type='submit' className='submit-button' disabled={isSubmitting}>
          {isSubmitting ? '생성 중...' : '플레이리스트 생성하기'}
        </button>
      </form>

      {/* 선택창 모달 */}
      {isModalOpen && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>플레이리스트 옵션 설정</h2>

            <input type='text' className='modal-input' placeholder='플레이리스트 제목 (선택사항)' value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value || '')} />

            <label className='checkbox-label'>
              <input className='checkbox' type='checkbox' checked={preferLatest} onChange={(e) => setPreferLatest(e.target.checked)} />
              최신곡을 선호합니다!
            </label>

            <button className='modal-close' onClick={() => setIsModalOpen(false)}>
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lyrics;
