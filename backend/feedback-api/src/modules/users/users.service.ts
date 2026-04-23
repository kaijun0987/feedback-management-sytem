import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import dayjs from 'dayjs';
import type { AuthUser } from '../../common/auth/auth-user';
import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';

interface UserRecord {
  id: string;
  userName: string;
  displayName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private get prisma() {
    return this.prismaService.client;
  }

  private isSuper(user: AuthUser) {
    return user.roles.includes(UserRole.R_SUPER);
  }

  private ensureRoleManageable(user: AuthUser, role: UserRole) {
    if (this.isSuper(user)) {
      return;
    }

    if (role !== UserRole.R_USER_COMMON) {
      throw new ForbiddenException('Admin can only create or edit common user accounts');
    }
  }

  private ensureTargetEditable(user: AuthUser, targetRole: UserRole) {
    if (this.isSuper(user)) {
      return;
    }

    if (targetRole !== UserRole.R_USER_COMMON) {
      throw new ForbiddenException('Only super can edit admin or super accounts');
    }
  }

  private toUserRecord(user: {
    id: string;
    userName: string;
    displayName: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
  }): UserRecord {
    return {
      id: user.id,
      userName: user.userName,
      displayName: user.displayName,
      role: user.role,
      isActive: user.isActive,
      createdAt: dayjs(user.createdAt).format('YYYY-MM-DD HH:mm')
    };
  }

  private async ensureUserNameUnique(userName: string, excludeUserId?: string) {
    const existing = await this.prisma.user.findFirst({
      where: {
        userName,
        ...(excludeUserId
          ? {
              NOT: {
                id: excludeUserId
              }
            }
          : {})
      }
    });

    if (existing) {
      throw new BadRequestException('User name already exists');
    }
  }

  async listUsers(query: ListUsersQueryDto, currentUser: AuthUser) {
    const keyword = query.keyword?.trim();
    const role = query.role;

    const where = {
      ...(this.isSuper(currentUser)
        ? role
          ? { role }
          : {}
        : {
            role: UserRole.R_USER_COMMON
          }),
      ...(keyword
        ? {
            OR: [
              {
                userName: {
                  contains: keyword,
                  mode: 'insensitive' as const
                }
              },
              {
                displayName: {
                  contains: keyword,
                  mode: 'insensitive' as const
                }
              }
            ]
          }
        : {})
    };

    const users = await this.prisma.user.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users.map(user => this.toUserRecord(user));
  }

  async createUser(payload: CreateUserDto, currentUser: AuthUser) {
    this.ensureRoleManageable(currentUser, payload.role);

    const userName = payload.userName.trim();
    const displayName = payload.displayName.trim();
    const password = payload.password.trim();

    await this.ensureUserNameUnique(userName);

    const created = await this.prisma.user.create({
      data: {
        userName,
        displayName,
        role: payload.role,
        isActive: payload.isActive,
        passwordHash: await hash(password, 10)
      }
    });

    return this.toUserRecord(created);
  }

  async updateUser(userId: string, payload: UpdateUserDto, currentUser: AuthUser) {
    const existing = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    this.ensureTargetEditable(currentUser, existing.role);
    this.ensureRoleManageable(currentUser, payload.role);

    const userName = payload.userName.trim();
    const displayName = payload.displayName.trim();
    const password = payload.password?.trim();

    await this.ensureUserNameUnique(userName, userId);

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        userName,
        displayName,
        role: payload.role,
        isActive: payload.isActive,
        ...(password
          ? {
              passwordHash: await hash(password, 10)
            }
          : {})
      }
    });

    return this.toUserRecord(updated);
  }
}
