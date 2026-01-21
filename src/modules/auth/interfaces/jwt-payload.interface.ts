import { Role } from 'src/modules/roles/entities/role.entity';

export interface JwtPayload {
  sub: string; // UserId (Thay vì id)
  phone: string; // Phone (Bắt buộc - vì login bằng phone)
  email?: string; // Email (Có thể có hoặc không)
  role?: string; // Role ID
}

// Interface mở rộng cho Request User (được gắn vào req.user)
export interface UserPayload {
  _id: string;
  email: string;
  role: Role; // Object Role đầy đủ (đã populate)
  isRoleActive: boolean;
  permissions?: any[]; // Nếu cần cache quyền
  refreshToken?: string; // Dùng cho Guard Refresh Token
}
