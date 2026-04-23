import { UserRole } from '@prisma/client';
import { IsBoolean, IsEnum, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userName!: string;

  @IsString()
  displayName!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsBoolean()
  isActive!: boolean;

  @IsString()
  @MinLength(6)
  password!: string;
}
