export class UserDTO {
    constructor(user) {
      this.id = user.id;
      this.email = user.email;
      this.name = user.name;
      this.provider = user.provider;
      this.accessToken = user.accessToken;
      this.refreshToken = user.refreshToken;
    }
  }