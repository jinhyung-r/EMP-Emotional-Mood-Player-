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

const sessionConfig = {
    key: 'auth_session',
    secret: config.SESSION_SECRET,
    Store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,              // http환경에서만 작동 -> 배포할시에는 https로 배포할건이니 true로 설정 혹은 환경변수로 두고 변경하는게 더 편리해보임
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 * 3     // 3일
    }
};

export default sessionConfig;