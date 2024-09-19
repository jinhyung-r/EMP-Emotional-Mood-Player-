// 각 전략에서 받은 객체를 세션에 저장
// 저장한 세션에서 serializeUser 정보 받고, provider, accT, refT 객체에 추가 => req.user로 토큰 접근 가능
// 데이터베이스에서 가져온 기본 사용자 정보에 세션의 인증 정보를 추가
import passport from 'passport';
import { findUserById } from '../services/userService.js';
import googleStrategy from './strategies/googleStrategy.js';
import spotifyStrategy from './strategies/spotifyStrategy.js';

const configurePassport = () => {
  passport.use(googleStrategy);
  passport.use(spotifyStrategy);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (serializedUser, done) => {
    try {
      const { id, provider, accessToken, refreshToken } = serializedUser;
      const user = await findUserById(id);
      if (user) {
        user.provider = provider;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default configurePassport;