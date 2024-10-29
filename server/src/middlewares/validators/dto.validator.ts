import { Request, Response, NextFunction } from 'express';
import { ValidationResult, Validator } from '@/shared/types/validation.types';
import { AppError, COMMON_ERROR } from '@utils/errors';
import { createLogger } from '@utils/logger';
import config from '@/config';

const logger = createLogger(config);

export class DTOValidator {
  static validate<T extends object>(validator: Validator<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        const validationResult = this.validateObject(req.body, validator);

        if (!validationResult.isValid) {
          throw new AppError(COMMON_ERROR.VALIDATION_ERROR.name, '입력값 검증 실패', {
            statusCode: COMMON_ERROR.VALIDATION_ERROR.statusCode,
            cause: new Error(JSON.stringify(validationResult.errors)),
          });
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  }

  private static validateObject<T extends object>(
    data: T,
    validator: Validator<T>,
  ): ValidationResult {
    const errors: ValidationError[] = [];

    for (const [field, rules] of Object.entries(validator)) {
      const value = data[field as keyof T];

      if (rules) {
        for (const rule of rules) {
          if (!rule.validate(value)) {
            errors.push({
              field,
              message: rule.message,
            });
            break; // 첫 번째 실패한 규칙에서 중단
          }
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
