import React from 'react';
import Questionnaire from './Questionnaire';

import '../../../styles/Survey.css';

function Emotions() {
  return (
    <div className='background-survey'>
      <h1 className='survey-title'>SURVEY</h1>
      <Questionnaire />
    </div>
  );
}

export default Emotions;
