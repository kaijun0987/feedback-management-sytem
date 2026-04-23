import { UserRole } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  userName!: string;

  @IsString()
  displayName!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsBoolean()
  isActive!: boolean;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
