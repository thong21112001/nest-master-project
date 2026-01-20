import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  PERMISSIONS_KEY,
  RequiredPermission,
} from '../decorators/require-permissions.decorator';
import { Role } from 'src/modules/roles/entities/role.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredPermission>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required) return true;

    //Định nghĩa rõ kiểu trả về của Request để tránh lỗi 'Unsafe member access'
    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    // Kiểm tra user có tồn tại và đã được populate role chưa
    if (!user || !user.role) {
      throw new ForbiddenException('Access Denied: No Role Assigned');
    }

    // Ép kiểu (Type Casting) để TypeScript hiểu rõ cấu trúc Role
    // (Vì trong User Entity, role có thể là ObjectId hoặc Object Role đầy đủ)
    const userRole = user.role as unknown as Role;

    if (userRole.slug === 'super_admin') return true;

    if (!userRole.isActive) throw new ForbiddenException('Role is inactive');

    // Kiểm tra cờ isRoleActive trên User (nếu có)
    if (user.isRoleActive === false) {
      throw new ForbiddenException('User permissions suspended');
    }

    // SO KHỚP QUYỀN
    const permission = userRole.permissions.find(
      (p) => p.resource === required.resource,
    );

    if (!permission || !permission.actions.includes(required.action)) {
      throw new ForbiddenException(
        `Missing permission: ${required.action} on ${required.resource}`,
      );
    }

    return true;
  }
}
