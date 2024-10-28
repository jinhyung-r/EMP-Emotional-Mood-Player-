import { Provider } from '@/shared/types/provider.js';

export interface OAuthProfile {
  id: string;
  displayName: string;
  emails: Array<{ value: string }>;
  provider: Provider;
}

export interface TokenInfo {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
