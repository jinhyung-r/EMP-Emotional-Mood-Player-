import { ValidationError, ValidationResult, Validator } from '@shared/types/validation.types';

export class ValidationUtils {
  static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  static isNumber(value: unknown): value is number {
    return typeof value === 'number' && !isNaN(value);
  }

  static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  static isEmail(value: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(value);
  }

  static isNotEmpty(value: string): boolean {
    return value.trim().length > 0;
  }

  static isLength(value: string, min: number, max: number): boolean {
    const length = value.trim().length;
    return length >= min && length <= max;
  }

  static isArray(value: unknown): value is unknown[] {
    return Array.isArray(value);
  }

  static isValidURL(value: string): boolean {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }
}
