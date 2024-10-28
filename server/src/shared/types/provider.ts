export type Provider = 'google' | 'spotify';

export interface ProviderConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}
