import { UserRole } from '@prisma/client';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsPhoneNumber('UZ')
  phone: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole = UserRole.CLIENT;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
