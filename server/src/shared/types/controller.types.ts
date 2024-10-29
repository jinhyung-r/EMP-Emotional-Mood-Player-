import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '@/auth/types/auth.types';
import { BaseResponse } from '@/shared/types/common';

export type ControllerFunction = (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export type AuthControllerFunction = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => Promise<void>;
