import { AppError, COMMON_ERROR } from '../utils/errors.js';

export const getUserInfo = (req, res, next) => {
  if (req.user) {
    res.json({
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      provider: req.user.provider
    });
  } else {
    next(new AppError(COMMON_ERROR.AUTHENTICATION_ERROR.name, '사용자 정보를 찾을 수 없습니다.', { statusCode: COMMON_ERROR.AUTHENTICATION_ERROR.statusCode }));
  }
};