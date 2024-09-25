export class UserDTO {
  #id;
  #provider;
  #email;
  #expiresAt;

  constructor(id, provider, email, expiresAt) {
    this.#id = id;
    this.#provider = provider;
    this.#email = email;
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