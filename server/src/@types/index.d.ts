import { Request } from 'express';
import { User as PrismaUser } from '@prisma/client';

// express request 확장
declare global {
  namespace Express {
    interface User extends PrismaUser {
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    }
  }
}
