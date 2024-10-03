export class AppError extends Error {
  constructor(name, description, options = {}) {
    super(description);
    this.name = name;
    this.statusCode = options.statusCode ?? 500;
    if (options.cause) {
      this.cause = options.cause;
    }
    Error.captureStackTrace(this, this.constructor);
  }
}

export const COMMON_ERROR = {
  AUTHENTICATION_ERROR: { name: 'Authentication Error', statusCode: 401 },
  AUTHORIZATION_ERROR: { name: 'Authorization Error', statusCode: 403 },
  EXTERNAL_API_ERROR: { name: 'External API Error', statusCode: 500 },    // 외부 api 사용할때 에러
  ARGUMENT_ERROR: { name: 'Argument Error', statusCode: 400 },            // 함수 및 api 호출 시 parameter 에러(타입스크립트 도입 시 자주 쓰일듯 => test?)
  BUSINESS_LOGIC_ERROR: { name: 'Business Logic Error', statusCode: 500 },
  CONFIG_ERROR: { name: 'Config Error', statusCode: 500 },
  DATABASE_ERROR: { name: 'Database Error', statusCode: 500 },
  FATAL_ERROR: { name: 'Fatal Error', statusCode: 500 },
  FILE_IO_ERROR: { name: 'File I/O Error', statusCode: 500 },           // 파일 경로, 권한 등 오류
  HTTP_ERROR: { name: 'HTTP Request Error', statusCode: 500 },          
  OPERATIONAL_ERROR: { name: 'Operational Error', statusCode: 500 },    // 코드 오류, 운영 환경 문제 -> 더 찾아볼 것
  PARSING_ERROR: { name: 'Parsing Error', statusCode: 400 },            // json, xml, yaml 등 parsing이 필요한 부분에서의 에러(요청 포맷 오류)
  RESOURCE_NOT_FOUND_ERROR: { name: 'Resource Not Found Error', statusCode: 404 },    // url, 파일, 데이터 없을 때
  UNKNOWN_ERROR: { name: 'Unknown Error', statusCode: 500 },
  VALIDATION_ERROR: { name: 'Validation Error', statusCode: 400 },
};

