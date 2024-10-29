export interface UserDTO {
  id: number;
  email: string;
  name: string;
  provider: string;
  providerId: string;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface CreateUserDTO {
  email: string;
  name: string;
  provider: string;
  providerId: string;
}

export interface UpdateProfileDTO {
  name?: string;
  email?: string;
}
