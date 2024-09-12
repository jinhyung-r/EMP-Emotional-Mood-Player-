import React, { useState } from 'react';
// import axios from 'axios';
import '../styles/Questionnaire.css';

function Questionnaire() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const questions = [
    {
      question: "현재의 기분을 선택해주세요.",
      answers: ["행복해요😊", "슬퍼요😢", "차분해요😌", "화나요😠", "신나요🤩", "피곤해요😴", "외로워요🥺", "사랑에빠졌어요❤️"]
    },
    {
      question: "지금 듣고 싶은 음악의 분위기는 어떤가요?",
      answers: ["밝고 경쾌한 🎉", "차분하고 잔잔한 🌙", "강렬하고 에너제틱한 ⚡", "감성적이고 서정적인 🌸", "어두운 느낌의 🎭", "로맨틱하고 달콤한 💕", "위로가 되는 🤗"]
    },
    {
      question: "이 순간에 어울리는 가사의 테마는 무엇인가요?",
      answers: ["사랑과 연애 💑", "이별과 그리움 💔", "꿈과 희망 🌟", "자기 성찰과 성장 🌱", "우정과 가족 👨‍👩‍👧‍👦", "자유와 모험 🏞️", "극복과 도전 🏅"]
    },
    {
      question: "선호하는 음악의 장르는 무엇인가요?",
      answers: ["팝 🎤", "힙합 🎧", "발라드 🎼", "락 🎸", "케이팝 🎶", "알앤비 🎵", "인디 🌿"]
    }
  ];

  const handleAnswerClick = (answer) => {
    setAnswers([...answers, answer]);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await axios.post('YOUR_SERVER_API_ENDPOINT', { answers });
  //     console.log('Server response:', response.data);
  //   } catch (error) {
  //     console.error('Error submitting answers:', error);
  //   }
  // };

  return (
    <div className="questionnaire-container">
      <p className="instruction">{questions[currentQuestion].question}</p>
      <div className="answers">
        {questions[currentQuestion].answers.map((answer, index) => (
          <button
            key={index}
            className="answer-button"
            onClick={() => handleAnswerClick(answer)}
          >
            {answer}
          </button>
        ))}
      </div>
      
      {currentQuestion === questions.length - 1 && (
        <button className="submit-button">{/* onClick={handleSubmit} */}
          제출하기
        </button>
      )}
    </div>
  );
}

export default Questionnaire;
