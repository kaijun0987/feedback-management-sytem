import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../../common/auth/auth-user';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('R_ADMIN', 'R_SUPER')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query() query: ListUsersQueryDto, @CurrentUser() user: AuthUser) {
    return this.usersService.listUsers(query, user);
  }

  @Post()
  async createUser(@Body() payload: CreateUserDto, @CurrentUser() user: AuthUser) {
    return this.usersService.createUser(payload, user);
  }

  @Put(':userId')
  async updateUser(@Param('userId') userId: string, @Body() payload: UpdateUserDto, @CurrentUser() user: AuthUser) {
    return this.usersService.updateUser(userId, payload, user);
  }
}
