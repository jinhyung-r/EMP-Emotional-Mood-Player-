export class UserDTO {
  constructor(id, provider, accessToken, refreshToken, expiresAt) {
    this.id = id;
    this.provider = provider;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
  }

  static fromEntity(user) {
    return new UserDTO(user.id, user.provider, user.accessToken, user.refreshToken, user.expiresAt);
  }

  toJSON() {
    return {
      id: this.id,
      provider: this.provider,
      accessToken: 'Stored securely',
      refreshToken: this.refreshToken ? 'Stored securely' : null,
      expiresAt: this.expiresAt,
    };
  }
}
