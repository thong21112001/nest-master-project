import { Role } from 'src/modules/roles/entities/role.entity';

export interface JwtPayload {
  id: string;
  user: string;
  roleId?: string; // ID của Role
  roleSlug?: string; // Slug (super_admin, user...)
  iss: string;
}

// Interface mở rộng cho Request User (được gắn vào req.user)
export interface UserPayload {
  _id: string;
  email: string;
  role?: Role | string | null; // Có thể chưa có role
  permissions?: any[]; // Nếu cần cache quyền
  refreshToken?: string; // Dùng cho Guard Refresh Token
}
