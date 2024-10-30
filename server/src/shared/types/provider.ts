export enum Provider {
  GOOGLE = 'GOOGLE',
  SPOTIFY = 'SPOTIFY',
}

export interface ProviderConfig {
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}
