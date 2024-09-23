export class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message, details);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.details = details;
    this.isOperationals = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 차후 계속적인 추가 가능 일단은 현재 구현 단계의 에러처리 정도 적어둠

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details = '') {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details = '') {
    super(message, 401, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details = '') {
    super(message, 403, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Not Found', details = '') {
    super(message, 404, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict', details = '') {
    super(message, 409, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', details = '') {
    super(message, 500, details);
  }
}

// 얘는 적기는 했는데 orm쓰면 에러 보내주지않나? 아직 모르겟음
// 뭐 정 못쓰면 서버킬때 쓰는것도?
export class DatabaseConnectionError extends AppError {
  constructor(message = 'Database Connection Error', details = '') {
    super(message, 500, details);
  }
}