import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../guards/permissions.guard';

export function BearerJwt() {
  return applyDecorators(
    ApiBearerAuth(), // Hiển thị nút khoá trên Swagger
    // Quan trọng: JwtAuthGuard chạy trước (để lấy user), PermissionsGuard chạy sau (để check quyền user đó)
    UseGuards(JwtAuthGuard, PermissionsGuard),
    ApiUnauthorizedResponse({
      description: 'Unauthorized - Token invalid or missing',
    }),
    ApiForbiddenResponse({
      description: 'Forbidden - Insufficient permissions',
    }),
  );
}
