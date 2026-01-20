import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

// Khi Update, ta không cho phép sửa username (thường là định danh cố định)
// và kế thừa các field khác ở dạng Optional
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username', 'phone', 'email'] as const),
) {}
