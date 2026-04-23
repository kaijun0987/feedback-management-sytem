import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../../common/auth/auth-user';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() payload: LoginDto) {
    return this.authService.login(payload);
  }

  @Get('getUserInfo')
  async getUserInfo(@Headers('authorization') authorization?: string) {
    return this.authService.getUserInfo(authorization);
  }

  @Post('refreshToken')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return this.authService.refreshToken(payload.refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Body() payload: ChangePasswordDto, @CurrentUser() user: AuthUser) {
    return this.authService.changePassword(user, payload);
  }
}
