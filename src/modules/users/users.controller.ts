import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';
import {
  ActionType,
  ResourceType,
} from 'src/common/constants/permission.const';

@ApiTags('Admin - Users Management')
@Controller('users')
// @BearerJwt() // Bảo vệ toàn bộ controller
export class UsersController {
  constructor(private readonly svc: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user (No role initially)' })
  @RequirePermissions(ResourceType.USER, ActionType.CREATE)
  create(@Body() dto: CreateUserDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list users' })
  @RequirePermissions(ResourceType.USER, ActionType.VIEW)
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user detail' })
  @RequirePermissions(ResourceType.USER, ActionType.VIEW)
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update profile' })
  @RequirePermissions(ResourceType.USER, ActionType.UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @RequirePermissions(ResourceType.USER, ActionType.DELETE)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
