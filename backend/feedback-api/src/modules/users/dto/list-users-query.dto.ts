import { UserRole } from '../../../generated/prisma';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class ListUsersQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
