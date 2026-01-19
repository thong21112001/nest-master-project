import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ActionType,
  ResourceType,
} from 'src/common/constants/permission.const';
import { RequirePermissions } from 'src/common/decorators/require-permissions.decorator';

@ApiTags('Admin - Roles Management')
@Controller('roles')
export class RolesController {
  constructor(private readonly svc: RolesService) {}

  @Get('metadata')
  @ApiOperation({ summary: 'Get permissions metadata for UI Matrix' })
  getMetadata() {
    return this.svc.getMetadata();
  }

  @Post()
  @ApiOperation({ summary: 'Create Role' })
  @RequirePermissions(ResourceType.ROLE, ActionType.CREATE)
  create(@Body() dto: CreateRoleDto) {
    return this.svc.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List role' })
  @RequirePermissions(ResourceType.ROLE, ActionType.VIEW)
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'View one role' })
  @RequirePermissions(ResourceType.ROLE, ActionType.VIEW)
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Role' })
  @RequirePermissions(ResourceType.ROLE, ActionType.UPDATE)
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Role' })
  @RequirePermissions(ResourceType.ROLE, ActionType.DELETE)
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
