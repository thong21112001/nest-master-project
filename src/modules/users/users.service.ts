import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Helper check trùng lặp
  private async checkExist(
    username: string,
    email: string,
    phone: string,
  ): Promise<void> {
    const exist = await this.userModel.findOne({
      $or: [{ username }, { email }, { phone }],
    });

    if (exist) {
      if (exist.username === username)
        throw new BadRequestException('Username already exists');
      if (exist.email === email)
        throw new BadRequestException('Email already exists');
      if (exist.phone === phone)
        throw new BadRequestException('Phone already exists');
    }
  }

  async create(dto: CreateUserDto) {
    // 1. Kiểm tra trùng lặp
    await this.checkExist(dto.username, dto.email, dto.phone);

    // 2. Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 3. Tạo User (Role mặc định là null do schema config)
    const newUser = await this.userModel.create({
      ...dto,
      password: hashedPassword,
      isRoleActive: false, // Vì mặc định không role
    });

    return this.sanitizeUser(newUser);
  }

  async findAll(): Promise<Partial<UserDocument>[]> {
    const users = await this.userModel
      .find()
      .populate('role', 'name slug')
      .sort({ createdAt: -1 })
      .exec();

    return users.map((u) => this.sanitizeUser(u));
  }

  async findOne(id: string): Promise<Partial<UserDocument>> {
    if (!Types.ObjectId.isValid(id))
      throw new BadRequestException('Invalid ID');

    const user = await this.userModel
      .findById(id)
      .populate('role', 'name slug permissions')
      .exec();

    if (!user) throw new NotFoundException('User not found');

    return this.sanitizeUser(user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<Partial<UserDocument>> {
    // Kiểm tra user tồn tại
    await this.findOne(id);

    const updateData: Partial<UserDocument> = { ...dto };

    // Nếu có đổi pass thì hash lại
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(dto.password, salt);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData as Record<string, unknown>, {
        new: true,
      })
      .populate('role', 'name slug')
      .exec();

    if (!updatedUser) throw new NotFoundException('User not found');

    return this.sanitizeUser(updatedUser);
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }

  // Dùng cho Login (Lấy password hash)
  async findByPhone(phone: string): Promise<UserDocument | null> {
    return this.userModel
      .findOne({ phone })
      .select('+password')
      .populate('role')
      .exec();
  }

  // Cập nhật lại token
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    return this.userModel.findByIdAndUpdate(userId, { refreshToken });
  }

  // Helper xóa field nhạy cảm
  private sanitizeUser(user: UserDocument): Partial<UserDocument> {
    const obj = user.toObject();
    delete obj.password;
    delete obj.refreshToken;
    return obj;
  }
}
