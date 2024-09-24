import { BadRequestError } from '../utils/errors.js';


// 물어보기
export class UserDTO {
  #id;
  #provider;
  #email;
  #expiresAt;
  // 엑세스토큰이랑 리프레시토큰을 dto에 넣는게 맞는가??
  #accessToken;
  #refreshToken;

  constructor(id, provider, email, expiresAt, accessToken, refreshToken) {
    this.setId(id);
    this.setProvider(provider);
    this.setEmail(email);
    this.setExpiresAt(expiresAt);
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }

  setId(id) {
    if (!id || typeof id !== 'number') {
      throw new BadRequestError('유효하지 않은 ID');
    }
    this.#id = id;
  }

  setProvider(provider) {
    if (!provider || typeof provider !== 'string') {
      throw new BadRequestError('유효하지 않은 provider');
    }
    this.#provider = provider;
  }

  setEmail(email) {
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      throw new BadRequestError('유효하지 않은 email');
    }
    this.#email = email;
  }

  setExpiresAt(expiresAt) {
    if (!expiresAt || typeof expiresAt !== 'number' || expiresAt <= Date.now()) {
      throw new BadRequestError('유효하지 않은 만료시간');
    }
    this.#expiresAt = expiresAt;
  }

  // 미정
  setAccessToken(accessToken) {
    if (!accessToken || typeof accessToken !== 'string') {
      throw new BadRequestError('유효하지 않은 accesstoken');
    }
    this.#accessToken = accessToken;
  }

  // 미정
  setRefreshToken(refreshToken) {
    if (!refreshToken || typeof refreshToken !== 'string') {
      throw new BadRequestError('유효하지 않은 refreshtoken');
    }
    this.#refreshToken = refreshToken;
  }

  getId() { return this.#id; }
  getProvider() { return this.#provider; }
  getEmail() { return this.#email; }
  getExpiresAt() { return this.#expiresAt; }
  // 미정
  getAccessToken() { return this.#accessToken; }
  getRefreshToken() { return this.#refreshToken; }

  static fromEntity(user) {
    return new UserDTO(
      user.id,
      user.provider,
      user.email,
      user.expiresAt,
      user.accessToken,
      user.refreshToken
    );
  }

  toJSON() {
    return {
      id: this.#id,
      provider: this.#provider,
      email: this.#email,
      expiresAt: this.#expiresAt,
      // 미정
      accessToken: this.#accessToken,
      refreshToken: this.#refreshToken
    };
  }
}