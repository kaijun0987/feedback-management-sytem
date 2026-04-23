import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { AuthUser } from '../../common/auth/auth-user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(payload: LoginDto) {
    const user = await this.prismaService.client.user.findFirst({
      where: {
        userName: payload.userName,
        isActive: true
      }
    });

    if (!user || !(await compare(payload.password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokenPayload = {
      sub: user.id,
      userName: user.userName,
      role: user.role
    };

    return this.createTokenPair(tokenPayload);
  }

  async getUserFromAuthorization(authorization?: string): Promise<AuthUser | null> {
    const token = authorization?.replace('Bearer ', '').trim();

    if (!token) {
      return null;
    }

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        userName: string;
        role: string;
      }>(token);

      const user = await this.prismaService.client.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user || !user.isActive) {
        return null;
      }

      return {
        userId: user.id,
        userName: user.userName,
        displayName: user.displayName,
        roles: [user.role]
      };
    } catch {
      return null;
    }
  }

  async getUserInfo(authorization?: string) {
    const user = await this.getUserFromAuthorization(authorization);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return {
      userId: user.userId,
      userName: user.userName,
      roles: user.roles,
      buttons: this.getButtonsByRoles(user.roles)
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        userName: string;
        role: string;
        type?: string;
      }>(refreshToken);

      if (payload.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.prismaService.client.user.findUnique({
        where: { id: payload.sub }
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.createTokenPair({
        sub: user.id,
        userName: user.userName,
        role: user.role
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(user: AuthUser, payload: ChangePasswordDto) {
    const existingUser = await this.prismaService.client.user.findUnique({
      where: { id: user.userId }
    });

    if (!existingUser || !existingUser.isActive) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const isCurrentPasswordValid = await compare(payload.currentPassword, existingUser.passwordHash);

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (payload.currentPassword === payload.newPassword) {
      throw new BadRequestException('New password must be different from the current password');
    }

    await this.prismaService.client.user.update({
      where: { id: user.userId },
      data: {
        passwordHash: await hash(payload.newPassword, 10)
      }
    });

    return true;
  }

  private getButtonsByRoles(roles: string[]) {
    if (roles.includes('R_SUPER')) {
      return ['B_CODE1', 'B_CODE2', 'B_CODE3'];
    }

    if (roles.includes('R_ADMIN')) {
      return ['B_CODE2', 'B_CODE3'];
    }

    return ['B_CODE3'];
  }

  private async createTokenPair(tokenPayload: { sub: string; userName: string; role: string }) {
    return {
      token: await this.jwtService.signAsync(tokenPayload, {
        expiresIn: '7d'
      }),
      refreshToken: await this.jwtService.signAsync(
        {
          ...tokenPayload,
          type: 'refresh'
        },
        { expiresIn: '30d' }
      )
    };
  }
}
