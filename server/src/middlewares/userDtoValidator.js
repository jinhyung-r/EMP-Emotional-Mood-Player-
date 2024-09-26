import { ValidationError } from '../utils/errors.js';
import { UserDTO } from '../DTOs/userDTO.js';

export const validateUserDto = (req, res, next) => {
  try {
    const userDto = UserDTO.fromEntity(req.user);

    // email check
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(userDto.getEmail())) {
      throw new ValidationError('유효하지 않은 이메일 형식입니다.');
    }

    // provier check
    if (!['google', 'spotify'].includes(userDto.getProvider())) {
      throw new ValidationError('유효하지 않은 제공자입니다.');
    }

    req.validatedUserDto = userDto;
    next();
  } catch (error) {
    next(error);
  }
};
