import { ValidationUtils } from '@/shared/utils/validator';
import { CreateUserDTO, UpdateUserDTO } from '@/users/types/user.types';
import { DTOValidator } from './dto.validator';

export const validateCreateUser = DTOValidator.validate<CreateUserDTO>({
  email: [
    {
      validate: (value): value is string =>
        ValidationUtils.isString(value) && ValidationUtils.isNotEmpty(value),
      message: '이메일은 필수입니다.',
    },
    {
      validate: (value) => ValidationUtils.isString(value) && ValidationUtils.isEmail(value),
      message: '유효한 이메일 형식이 아닙니다.',
    },
  ],
  name: [
    {
      validate: (value): value is string =>
        ValidationUtils.isString(value) && ValidationUtils.isNotEmpty(value),
      message: '이름은 필수입니다.',
    },
    {
      validate: (value) =>
        ValidationUtils.isString(value) && ValidationUtils.isLength(value, 2, 50),
      message: '이름은 2-50자 사이여야 합니다.',
    },
  ],
  provider: [
    {
      validate: (value): value is string =>
        ValidationUtils.isString(value) && ['google', 'spotify'].includes(value),
      message: '유효한 제공자가 아닙니다.',
    },
  ],
});

export const validateUpdateUser = DTOValidator.validate<UpdateUserDTO>({
  name: [
    {
      validate: (value) =>
        !value || (ValidationUtils.isString(value) && ValidationUtils.isLength(value, 2, 50)),
      message: '이름은 2-50자 사이여야 합니다.',
    },
  ],
});
