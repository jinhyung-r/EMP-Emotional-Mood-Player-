import * as session from 'express-session';
import mysqlSession from 'express-mysql-session';
import { Config } from '@/shared/types/common';
import config from '@/config';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { createLogger } from '@utils/logger';
import { SessionConfig, SessionStoreOptions } from '../types/session';

const MySQLStore = mysqlSession(session);
const logger = createLogger(config); // 혹은 appConfig로 대체 가능

export function createSessionStore(appConfig: Config): SessionConfig {
  const storeOptions: SessionStoreOptions = {
    host: appConfig.MYSQL_HOST,
    port: 3306,
    user: appConfig.MYSQL_USER,
    password: appConfig.MYSQL_PW,
    database: appConfig.MYSQL_NAME,
  };

  const store = new MySQLStore(storeOptions);

  store.on('error', (err: Error) => {
    logger.error('Session store error:', err);
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Session store error', {
      cause: err,
      statusCode: COMMON_ERROR.DATABASE_ERROR.statusCode,
    });
  });

  return {
    key: 'auth_session',
    secret: appConfig.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: appConfig.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 * 3, // 3일
    },
  };
}
