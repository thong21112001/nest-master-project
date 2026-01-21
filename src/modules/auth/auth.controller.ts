import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register-auth.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { UserDocument } from '../users/entities/user.entity';
import { BearerJwt } from 'src/common/decorators/bearer-jwt.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with Phone & Password' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh Access Token' })
  refreshTokens(@CurrentUser() user: UserDocument & { refreshToken: string }) {
    return this.authService.refreshTokens(
      user._id.toString(),
      user.refreshToken,
    );
  }

  @Post('logout')
  @BearerJwt()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout (Revoke Refresh Token)' })
  logout(@CurrentUser() user: UserDocument) {
    return this.authService.logout(user._id.toString());
  }
}
