export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export type ValidationRule<T> = {
  validate: (value: T) => boolean;
  message: string;
};

export type Validator<T> = {
  [K in keyof T]?: ValidationRule<T[K]>[];
};
