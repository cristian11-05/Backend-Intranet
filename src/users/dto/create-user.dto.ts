import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsEnum, IsIn, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '@prisma/client';
import { sanitizeEmpresa } from '../../common/utils/string.utils';


export class CreateUserDto {
    @ApiProperty({ example: '12345678', description: 'User document number' })
    @IsString()
    @IsNotEmpty()
    documento: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'password123', description: 'User password', required: false })
    @IsString()
    @IsOptional()
    contrasena?: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name', required: true })
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @ApiProperty({
        example: 'OBRERO',
        description: 'User role/contract type',
        enum: UserRole,
        default: UserRole.OBRERO
    })
    @IsEnum(UserRole, { message: 'rol must be one of: OBRERO, TRABAJADOR, EMPLEADO, ADMIN' })
    @IsOptional()
    rol?: UserRole;

    @ApiProperty({ example: 1, description: 'Area ID (Department)', required: true })
    @IsInt()
    @IsNotEmpty()
    area_id: number;

    @ApiProperty({ example: 'Activo', description: 'User status', default: 'Activo' })
    @IsOptional()
    estado?: string;

    @ApiProperty({
        example: 'AQUANQA I',
        description: 'Company name',
        enum: ['AQUANQA I', 'AQUANQA II'],
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @Transform(({ value }) => sanitizeEmpresa(value))
    @IsIn(['AQUANQA I', 'AQUANQA II'], { message: 'empresa must be either AQUANQA I or AQUANQA II' })
    empresa: string;



    // Optional fields for legacy/compatibility or internal use
    @IsString()
    @IsOptional()
    dni?: string;

    @IsString()
    @IsOptional()
    password?: string;
}

