import ReactDOM from 'react-dom/client';
import App from './App';
import React from 'react';
import { RecoilRoot } from 'recoil';

// //MSW 서비스 워커 가져오기 (개발환경에서만)
// if (process.env.NODE_ENV === 'development') {
//   const { worker } = require('./mocks/browser');
//   worker.start();
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
);
