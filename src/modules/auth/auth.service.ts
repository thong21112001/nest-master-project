import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login-auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register-auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // 1. Đăng ký người dùng - có thể sử dụng chung với admin - client
  async register(dto: RegisterDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.usersService.create({
      ...dto,
      role: null, // Mặc định chưa có role
    } as any);
  }

  // 2. Đăng nhập
  async login(dto: LoginDto) {
    // Tìm user
    const user = await this.usersService.findByPhone(dto.phone);

    if (!user || !user.password) {
      throw new UnauthorizedException('Phone or password incorrect');
    }

    // Check pass
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('Phone or password incorrect');

    if (!user._id) throw new UnauthorizedException('User ID invalid');

    const userIdStr = user._id.toString();
    // Tạo token
    const tokens = await this.getTokens(userIdStr, user.phone);
    // Lưu Refresh Token vào DB (Hash trước khi lưu để bảo mật)
    await this.updateRefreshToken(userIdStr, tokens.refreshToken);

    return {
      user: {
        _id: user._id,
        phone: user.phone,
        email: user.email, // Có thể null
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  // 3. Refresh Token (Cấp lại token mới)
  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    // So sánh Token gửi lên vs Token Hash trong DB
    const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    if (!user._id) throw new UnauthorizedException('User ID invalid');
    if (!user.phone) throw new UnauthorizedException('User phone missing');

    const userIdStr = user._id.toString();

    const tokens = await this.getTokens(userIdStr, user.phone);
    await this.updateRefreshToken(userIdStr, tokens.refreshToken);

    return tokens;
  }

  // 4. Logout
  async logout(userId: string) {
    // Xóa refresh token trong DB
    return this.usersService.updateRefreshToken(userId, null);
  }

  // --- HELPER FUNCTIONS ---
  async updateRefreshToken(userId: string, refreshToken: string | null) {
    // Luôn hash token trước khi lưu xuống DB
    const hash = refreshToken ? await bcrypt.hash(refreshToken, 10) : null;
    await this.usersService.updateRefreshToken(userId, hash);
  }

  private async getTokens(userId: string, phone: string) {
    const payload: JwtPayload = {
      sub: userId,
      phone: phone,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        // FIX LỖI 2: Thêm <string> để báo rõ kiểu trả về
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_EXPIRATION',
        ) as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_EXPIRATION',
        ) as any,
      }),
    ]);

    return { accessToken: at, refreshToken: rt };
  }
}
