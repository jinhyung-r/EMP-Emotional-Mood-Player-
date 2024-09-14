import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { findOrCreateUser, findUserById } from '../services/userService.js';
import config from './index.js';



// 각 전략에서 받은 객체를 세션에 저장
// 저장한 세션에서 serializeUser 정보 받고, provider, accT, refT 객체에 추가 => req.user로 토큰 접근 가능
// 데이터베이스에서 가져온 기본 사용자 정보에 세션의 인증 정보를 추가
const configurePassport = () => {
  const setupStrategy = (name, Strategy, clientID, clientSecret, callbackURL) => {
    passport.use(new Strategy({
      clientID,
      clientSecret,
      callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await findOrCreateUser(profile, name);
        done(null, { 
          id: user.id,
          provider: name,
          accessToken,
          refreshToken
        });
      } catch (error) {
        done(error, null);
      }
    }));
  };

  setupStrategy('google', GoogleStrategy, config.GOOGLE_CLIENT_ID, config.GOOGLE_CLIENT_SECRET, config.GOOGLE_REDIRECT_URI);
  setupStrategy('spotify', SpotifyStrategy, config.SPOTIFY_CLIENT_ID, config.SPOTIFY_CLIENT_SECRET, config.SPOTIFY_REDIRECT_URI);

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
