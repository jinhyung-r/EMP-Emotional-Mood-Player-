import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from '../index.js';
import { findOrCreateUser } from '../../services/userService.js';

export default new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: config.GOOGLE_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, 'google');
    done(null, { 
      id: user.id,
      provider: 'google',
      accessToken,
      refreshToken
    });
  } catch (error) {
    done(error, null);
  }
});