import React, { useState } from 'react';
import axiosInstance from '../../apis/axiosInstance';
import '../../styles/Questionnaire.css';

function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [slideDirection, setSlideDirection] = useState('');
  const [isSliding, setIsSliding] = useState(false);

  const questions = [
    {
      question: '현재의 기분을 선택해주세요.',
      answers: ['행복해요😊', '슬퍼요😢', '차분해요😌', '화나요😠', '신나요🤩', '피곤해요😴', '외로워요🥺', '사랑에빠졌어요❤️'],
    },
    {
      question: '지금 듣고 싶은 음악의 분위기는 어떤가요?',
      answers: ['밝고 경쾌한 🎉', '차분하고 잔잔한 🌙', '강렬하고 에너제틱한 ⚡', '감성적이고 서정적인 🌸', '어두운 느낌의 🎭', '로맨틱하고 달콤한 💕', '위로가 되는 🤗'],
    },
    {
      question: '이 순간에 어울리는 가사의 테마는 무엇인가요?',
      answers: ['사랑과 연애 💑', '이별과 그리움 💔', '꿈과 희망 🌟', '자기 성찰과 성장 🌱', '우정과 가족 👨‍👩‍👧‍👦', '자유와 모험 🏞️', '극복과 도전 🏅'],
    },
    {
      question: '선호하는 음악의 장르는 무엇인가요?',
      answers: ['팝 🎤', '힙합 🎧', '발라드 🎼', '락 🎸', '케이팝 🎶', '알앤비 🎵', '인디 🌿'],
    },
  ];

  const handleAnswerClick = (answer) => {
    setAnswers([...answers, answer]);
    if (currentQuestion < questions.length - 1) {
      setSlideDirection('left');
      setIsSliding(true);
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSlideDirection('');
        setIsSliding(false);
      }, 300);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/emotion-playlist', { answers });
      console.log('Server response:', response.data);
      // 서버로부터 플레이리스트 ID를 받으면 /myplaylist || /myplaylist/${playlistId}로 이동?
    } catch (error) {
      console.error('Error submitting emotions:', error);
    }
  };

  return (
    <div className='questionnaire-container'>
      <div className={`question-slide ${slideDirection} ${currentQuestion === questions.length - 1 ? 'static-question' : ''}`}>
        <p className='instruction'>{questions[currentQuestion].question}</p>
        <div className='answers'>
          {questions[currentQuestion].answers.map((answer, index) => (
            <button
              key={index}
              className='answer-button'
              onClick={() => handleAnswerClick(answer)}
              disabled={isSliding} // 슬라이딩 중일 때 버튼 클릭 방지
            >
              {answer}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion === questions.length - 1 && (
        <button className='submit-button' onClick={handleSubmit}>
          제출하기
        </button>
      )}
    </div>
  );
}

export default Questionnaire;
