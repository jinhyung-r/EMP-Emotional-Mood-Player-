import { BadRequestError } from '../utils/errors.js';

export class UserDTO {
  #id;
  #provider;
  #email;
  #expiresAt;

  constructor(id, provider, email, expiresAt) {
    this.setId(id);
    this.setProvider(provider);
    this.setEmail(email);
    this.setExpiresAt(expiresAt);
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

  getId() { return this.#id; }
  getProvider() { return this.#provider; }
  getEmail() { return this.#email; }
  getExpiresAt() { return this.#expiresAt; }

  static fromEntity(user) {
    return new UserDTO(
      user.id,
      user.provider,
      user.email,
      user.expiresAt
    );
  }

  toJSON() {
    return {
      id: this.#id,
      provider: this.#provider,
      email: this.#email,
      expiresAt: this.#expiresAt
    };
  }
}