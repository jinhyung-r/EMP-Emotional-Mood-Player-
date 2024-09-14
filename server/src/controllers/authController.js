// 사용자의 db에 따른 리다렉 경로 정의 필요
// playlist 존재하면 playlist, 없으면 /create로..

import { UserDTO } from '../middlewares/DTOs/index.js';

export const oauthCallback = (req, res) => {
  req.session.user = new UserDTO(req.user);
  res.redirect('/create');
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);          // 역시 에러처리 필요
    }
    res.clearCookie('auth_session');
    res.redirect('/home');
  });
};