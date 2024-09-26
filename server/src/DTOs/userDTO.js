import { ValidationError } from '../utils/errors.js';
import logger from '../utils/logger.js';

export class UserDTO {
  #id;
  #email;
  #provider;
  #name;
  #createdAt;

  constructor(id, email, provider, name, createdAt) {
    this.#id = id;
    this.#email = email;
    this.#provider = provider;
    this.#name = name;
    this.#createdAt = createdAt;
    this.validateBasic();
  }

  getId() {
    return this.#id;
  }
  getEmail() {
    return this.#email;
  }
  getProvider() {
    return this.#provider;
  }
  getName() {
    return this.#name;
  }
  getCreatedAt() {
    return this.#createdAt;
  }

  static fromEntity(user) {
    logger.debug('google user profile:', user);
    return new UserDTO(user.id, user.email, user.provider, user.name, new Date());
  }

  toJSON() {
    return {
      id: this.#id,
      email: this.#email,
      provider: this.#provider,
      name: this.#name,
      createdAt: this.#createdAt,
    };
  }

  validateBasic() {
    if (!Number.isInteger(this.#id) || this.#id <= 0) {
      throw new ValidationError('유효하지 않은 ID입니다.');
    }
    if (!this.#email || typeof this.#email !== 'string') {
      throw new ValidationError('유효하지 않은 이메일 형식입니다.');
    }
    if (!this.#provider || typeof this.#provider !== 'string') {
      throw new ValidationError('유효하지 않은 제공자입니다.');
    }
    if (!this.#name || typeof this.#name !== 'string') {
      throw new ValidationError('유효하지 않은 이름입니다.');
    }
    if (!(this.#createdAt instanceof Date)) {
      throw new ValidationError('유효하지 않은 생성 날짜입니다.');
    }
  }
}
