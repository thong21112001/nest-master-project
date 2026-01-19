import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  ActionType,
  ResourceType,
} from 'src/common/constants/permission.const';

export type RoleDocument = HydratedDocument<Role>;

export class Permission {
  @Prop({ enum: ResourceType, required: true })
  resource: ResourceType;

  @Prop({ type: [String], enum: ActionType, default: [] })
  actions: ActionType[];
}

@Schema({ timestamps: true })
export class Role {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ unique: true })
  slug: string; // Tự động tạo từ name (ví dụ: 'super-admin')

  @Prop({ default: false })
  isSystem: boolean; // Nếu true -> Không cho phép xóa

  @Prop({ default: '' })
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  // Danh sách quyền hạn (Ví dụ: ['users.create', 'users.delete'])
  @Prop({ type: [Permission], default: [] })
  permissions: Permission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
