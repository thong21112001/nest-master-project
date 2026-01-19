import { ApiProperty } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  ActionType,
  ResourceType,
} from 'src/common/constants/permission.const';

class PermissionDto {
  @ApiProperty({ enum: ResourceType })
  @IsEnum(ResourceType)
  resource: ResourceType;

  @ApiProperty({ enum: ActionType, isArray: true })
  @IsEnum(ActionType, { each: true })
  @IsArray()
  actions: ActionType[];
}

export class CreateRoleDto {
  @ApiProperty({ example: 'Nhân viên kho' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: unknown }) => {
    return typeof value === 'string' ? value.trim() : value;
  })
  name: string;

  @ApiProperty({ example: 'Quản lý xuất nhập tồn' })
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    return typeof value === 'string' ? value.trim() : value;
  })
  description: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ type: [PermissionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions: PermissionDto[];
}
