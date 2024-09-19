import { Strategy as SpotifyStrategy } from 'passport-spotify';
import config from '../index.js';
import { findOrCreateUser } from '../../services/userService.js';

export default new SpotifyStrategy({
  clientID: config.SPOTIFY_CLIENT_ID,
  clientSecret: config.SPOTIFY_CLIENT_SECRET,
  callbackURL: config.SPOTIFY_REDIRECT_URI
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await findOrCreateUser(profile, 'spotify');
    done(null, { 
      id: user.id,
      provider: 'spotify',
      accessToken,
      refreshToken
    });
  } catch (error) {
    done(error, null);
  }
});