import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import config from './index.js';

const MySQLStoreSession = MySQLStore(session);

const sessionStore = new MySQLStoreSession({
  host: config.MYSQL_HOST,
  port: 3306,
  user: config.MYSQL_USER,
  password: config.MYSQL_PW,
  db: config.MYSQL_NAME,
});

// httpOnly + signed cookie
const sessionConfig = {
  key: 'auth_session',
  secret: config.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',      // production -> true
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 * 3, // 3일
    signed: true,
  },
};

export default sessionConfig;
