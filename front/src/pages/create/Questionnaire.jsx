import React, { useState } from 'react';
// import axios from 'axios';
import '../../styles/Questionnaire.css';

function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [slideDirection, setSlideDirection] = useState(''); // 슬라이드 방향을 저장
  const [isSliding, setIsSliding] = useState(false); // 애니메이션 진행 상태를 저장

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

    // 마지막 질문 전까지 슬라이드 효과 적용
    if (currentQuestion < questions.length - 1) {
      setSlideDirection('left'); // 슬라이드 방향 설정
      setIsSliding(true); // 슬라이드 애니메이션 시작

      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSlideDirection(''); // 슬라이드 방향 초기화
        setIsSliding(false); // 슬라이드 애니메이션 종료
      }, 300); // 애니메이션 시간과 맞춰줌
    }
  };

  // API 명세 확정시 서버에 김장설문 결과 데이터 전달
  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post('YOUR_SERVER_API_ENDPOINT', { answers });
  //     console.log('Server response:', response.data);
  //   } catch (error) {
  //     console.error('Error submitting answers:', error);
  //   }
  // };

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
        <button className='submit-button'>
          {/* onClick=handleSubmit */}
          제출하기
        </button>
      )}
    </div>
  );
}

export default Questionnaire;
