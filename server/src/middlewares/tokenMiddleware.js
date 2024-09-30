import { checkAndRefreshTokenIfNeeded } from '../services/authService.js';
import logger from '../utils/logger.js';
import { UnauthorizedError, InternalServerError } from '../utils/errors.js';


// 토큰 갱신이 성공하면 세션업데이트 -> next로
// 인증되지않는 사용자 -> unauthorizedError
// 오류처리는 역시 errorHandler로 넘기기
// 다음스텝으로 에러처리 로직 변경 후 적용 필요
export const checkAndRefreshToken = async (req, res, next) => {
  if (req.isAuthenticated() && req.user) {
    try {
      const tokenRefreshed = await checkAndRefreshTokenIfNeeded(req.user);
      if (tokenRefreshed) {
        req.session.user = req.user;
        await new Promise((resolve, reject) => {
          req.session.save((err) => {
            if (err) {
              logger.error('세션 저장 중 오류 발생:', err);
              reject(new InternalServerError('세션 저장 중 오류가 발생했습니다.'));
            } else {
              resolve();
            }
          });
        });
      }
      next();
    } catch (error) {
      logger.error(`토큰 refresh 에러: ${error.message}`);
      if (error instanceof UnauthorizedError) {
        req.logout((err) => {
          if (err) {
            logger.error(`로그아웃 에러: ${err.message}`);
          }
          next(new UnauthorizedError('인증에 실패했습니다. 다시 로그인해주세요.'));
        });
      } else {
        next(new InternalServerError('토큰 갱신 중 오류가 발생했습니다.'));
      }
    }
  } else {
    // 인증되지 않은 사용자에 대한 처리
    next(new UnauthorizedError('인증이 필요합니다.'));
  }
};