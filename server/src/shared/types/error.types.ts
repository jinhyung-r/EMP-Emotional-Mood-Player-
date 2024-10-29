export interface ErrorOptions {
  statusCode?: number;
  cause?: Error;
  isOperational?: boolean;
}

export interface CommonError {
  name: string;
  statusCode: number;
}
