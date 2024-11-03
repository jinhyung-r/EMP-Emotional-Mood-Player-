import { Request, Response, NextFunction } from 'express';
import {
  ValidationResult,
  ValidationError,
  Validator,
  ValidationRule,
} from '@/shared/types/validation.types';
import { AppError, COMMON_ERROR } from '@utils/errors';

export class DTOValidator {
  static validate<T extends object>(validator: Validator<T>) {
    return (req: Request, _res: Response, next: NextFunction) => {
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

    Object.entries(validator).forEach(([field, rules]) => {
      const value = data[field as keyof T];

      if (rules && Array.isArray(rules)) {
        for (const rule of rules as ValidationRule<T[keyof T]>[]) {
          if (!rule.validate(value)) {
            errors.push({
              field,
              message: rule.message,
            });
            break;
          }
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
