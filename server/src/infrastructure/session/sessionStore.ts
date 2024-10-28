import * as session from 'express-session'; // `* as` 구문으로 수정
import mysqlSession from 'express-mysql-session';
import { Config } from '@/shared/types/common';
import { AppError, COMMON_ERROR } from '@/utils/errors';
import { createLogger } from '@/utils/logger';
import { SessionConfig, SessionStoreOptions } from '../types/session';
import config from '@/config';

const logger = createLogger(config);

// MySQLStore 타입 정의
const MySQLStore = mysqlSession(session);

export function createSessionStore(appConfig: Config): SessionConfig {
  const storeOptions: SessionStoreOptions = {
    host: appConfig.MYSQL_HOST,
    port: 3306,
    user: appConfig.MYSQL_USER,
    password: appConfig.MYSQL_PW,
    database: appConfig.MYSQL_NAME,
  };

  // MySQLStore 인스턴스 생성
  const store = new MySQLStore(storeOptions) as session.Store;

  // 에러 이벤트 리스너 추가
  store.on('error', (err: Error) => {
    logger.error('Session store 에러:', err);
    throw new AppError(COMMON_ERROR.DATABASE_ERROR.name, 'Session store 에러', {
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
