import { Store } from 'express-session';
import { AuthUser } from '@/auth/types/auth.types';

export interface SessionConfig {
  key: string;
  secret: string;
  store: Store;
  resave: boolean;
  saveUninitialized: boolean;
  cookie: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: boolean | 'lax' | 'strict' | 'none';
    maxAge: number;
  };
}

export interface SessionStoreOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  createDatabaseTable?: boolean;
  schema?: {
    tableName: string;
    columnNames: {
      session_id: string;
      expires: string;
      data: string;
    };
  };
}

declare module 'express-session' {
  interface SessionData {
    user?: AuthUser;
  }
}
