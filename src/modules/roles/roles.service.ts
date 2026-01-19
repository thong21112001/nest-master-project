import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/role.entity';
import { Model, UpdateQuery } from 'mongoose';
import {
  ActionType,
  ResourceType,
} from 'src/common/constants/permission.const';
import { getSlug } from 'src/common/utils/get-slug.util';

@Injectable()
export class RolesService implements OnModuleInit {
  private readonly logger = new Logger(RolesService.name);

  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async onModuleInit() {
    await this.seedRoles();
  }

  async seedRoles() {
    const allPermissions = Object.values(ResourceType).map((res) => ({
      resource: res,
      actions: Object.values(ActionType),
    }));

    const roles = [
      {
        name: 'Super Admin',
        slug: 'super_admin',
        description: 'System Administrator - Full Access',
        isSystem: true,
        permissions: allPermissions,
      },
      {
        name: 'User',
        slug: 'user',
        description: 'Default User Role',
        isSystem: true,
        permissions: [],
      },
    ];

    for (const role of roles) {
      // Upsert: Tìm thấy thì update, chưa thấy thì create
      await this.roleModel.findOneAndUpdate({ slug: role.slug }, role, {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      });
    }
    this.logger.log('Roles seeded successfully');
  }

  // --- CRUD METHODS ---

  getMetadata() {
    return {
      resources: Object.values(ResourceType),
      actions: Object.values(ActionType),
    };
  }

  async create(dto: CreateRoleDto) {
    const slug = getSlug(dto.name, { replacement: '_' });
    const exist = await this.roleModel.findOne({ slug });
    if (exist) throw new BadRequestException('Role name already exists');

    return this.roleModel.create({ ...dto, slug, isSystem: false });
  }

  async findAll() {
    // Ẩn Super Admin để tránh bị user thường nhìn thấy hoặc sửa nhầm
    return this.roleModel.find({ slug: { $ne: 'super_admin' } }).exec();
  }

  async getDropdown() {
    return this.roleModel
      .find({ isActive: true, slug: { $ne: 'super_admin' } })
      .select('name _id slug')
      .exec();
  }

  async findOne(id: string) {
    return this.roleModel
      .findById(id)
      .orFail(new NotFoundException('Role not found'));
  }

  async update(id: string, dto: UpdateRoleDto) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    const updateData: UpdateQuery<Role> = { ...dto };

    if (role.isSystem) {
      delete updateData.slug; // Không cho sửa slug của System Role
    } else if (dto.name && dto.name !== role.name) {
      const newSlug = getSlug(dto.name, { replacement: '_' });

      const duplicate = await this.roleModel.findOne({
        slug: newSlug,
        _id: { $ne: id },
      });

      if (duplicate) throw new BadRequestException('Role name already exists');

      updateData.slug = newSlug;
    }

    return this.roleModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async remove(id: string) {
    const role = await this.roleModel.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    if (role.isSystem)
      throw new BadRequestException('Cannot delete System Role');

    return this.roleModel.findByIdAndDelete(id);
  }
}
