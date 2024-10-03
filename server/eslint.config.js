import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // 언더스코어로 시작하는 변수에 대한 경고를 무시
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  pluginJs.configs.recommended,
];
