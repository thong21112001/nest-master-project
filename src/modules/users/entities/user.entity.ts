import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Gender } from 'src/common/enum/gender.enum';
import { Status } from 'src/common/enum/status.enum';
import { Role } from 'src/modules/roles/entities/role.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true, index: true, unique: true })
  username: string;

  @Prop({ required: true, lowercase: true, index: true, unique: true })
  email?: string;

  @Prop({ required: true, index: true, unique: true })
  phone: string;

  @Prop({ select: false })
  password: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Role.name,
    required: false,
    default: null,
  })
  role: Role | null;

  // Dùng để khoá quyền của user hiện tại
  // true: Đang nắm quyền (bình thường)
  // false: Bị treo quyền (vẫn giữ chức danh role, nhưng không làm được gì)
  @Prop({ default: true })
  isRoleActive: boolean;

  @Prop()
  name: string;

  @Prop()
  avatar?: string;

  @Prop({ default: Gender.Other })
  gender?: Gender;

  @Prop({ default: Status.Active })
  status?: Status;

  @Prop()
  birth?: Date;

  @Prop()
  createdBy?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([
    {
      type: String,
    },
  ])
  refreshToken?: Types.Array<string>;
}

export const UserSchema = SchemaFactory.createForClass(User);
