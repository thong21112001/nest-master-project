import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/common/enum/gender.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'nguyenvana' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  username: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toLowerCase().trim() : value,
  )
  email: string;

  @ApiProperty({ example: '0901234567' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;

  /**
   * gender
   * @example [male, female, other]
   */
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  /**
   * Date of birth
   * @example "2026-01-20"
   */
  @IsDateString()
  @IsOptional()
  birth?: Date;
}
