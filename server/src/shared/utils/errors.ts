import { ErrorOptions, CommonError } from '@shared/types/error.types';

export const COMMON_ERROR: Record<string, CommonError> = {
  AUTHENTICATION_ERROR: { name: 'Authentication Error', statusCode: 401 },
  AUTHORIZATION_ERROR: { name: 'Authorization Error', statusCode: 403 },
  EXTERNAL_API_ERROR: { name: 'External API Error', statusCode: 500 },
  ARGUMENT_ERROR: { name: 'Argument Error', statusCode: 400 },
  BUSINESS_LOGIC_ERROR: { name: 'Business Logic Error', statusCode: 500 },
  CONFIG_ERROR: { name: 'Config Error', statusCode: 500 },
  DATABASE_ERROR: { name: 'Database Error', statusCode: 500 },
  FATAL_ERROR: { name: 'Fatal Error', statusCode: 500 },
  FILE_IO_ERROR: { name: 'File I/O Error', statusCode: 500 },
  HTTP_ERROR: { name: 'HTTP Request Error', statusCode: 500 },
  OPERATIONAL_ERROR: { name: 'Operational Error', statusCode: 500 },
  PARSING_ERROR: { name: 'Parsing Error', statusCode: 400 },
  RESOURCE_NOT_FOUND_ERROR: { name: 'Resource Not Found Error', statusCode: 404 },
  UNKNOWN_ERROR: { name: 'Unknown Error', statusCode: 500 },
  VALIDATION_ERROR: { name: 'Validation Error', statusCode: 400 },
} as const;

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly cause?: Error;

  constructor(name: string, message: string, options: ErrorOptions = {}) {
    super(message);
    this.name = name;
    this.statusCode = options.statusCode ?? 500;
    this.isOperational = options.isOperational ?? true;

    if (options.cause) {
      this.cause = options.cause;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}
