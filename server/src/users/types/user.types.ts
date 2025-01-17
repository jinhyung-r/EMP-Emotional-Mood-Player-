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

export interface UpdateUserDTO {
  name?: string;
}

export type UpdateProfileDTO = {
  name?: string;
  email?: string;
};
