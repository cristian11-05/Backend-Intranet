import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role, UserStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '71234567' })
  @IsNotEmpty()
  @IsString()
  documento: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'juan.perez@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  contrasena: string;

  @ApiProperty({ example: 'uuid-area', required: false })
  @IsOptional()
  @IsString()
  area_id?: string;

  @ApiProperty({ enum: Role, default: Role.EMPLEADO })
  @IsOptional()
  @IsEnum(Role)
  rol?: Role;

  @ApiProperty({ enum: UserStatus, default: UserStatus.ACTIVO })
  @IsOptional()
  @IsEnum(UserStatus)
  estado?: UserStatus;
}
