import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsEnum, IsIn } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateUserDto {
    @ApiProperty({ example: '12345678', description: 'User document number' })
    @IsString()
    @IsOptional() // Logic says optional because sometimes it's auto-generated or handled differently, but let's check controller logic. Controller says if !password && documento, use documento.
    documento?: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    // @IsEmail() // Allow DNI as email identifier
    @IsOptional() // Controller logic implies email can be generated from documento
    email?: string;

    @ApiProperty({ example: 'password123', description: 'User password', required: false })
    @IsString()
    @IsOptional()
    contrasena?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    dni?: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({
        example: 'OBRERO',
        description: 'User role/contract type',
        enum: UserRole,
        default: UserRole.OBRERO
    })
    @IsEnum(UserRole, { message: 'rol must be one of: OBRERO, TRABAJADOR, EMPLEADO, ADMIN' })
    @IsOptional()
    rol?: UserRole;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    tipo_contrato?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    area_id?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    areaId?: string;

    @ApiProperty({ example: 'Activo', description: 'User status', default: 'Activo' })
    @IsOptional()
    estado?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    status?: string;

    @ApiProperty({
        example: 'Aquanqa 1',
        description: 'Company name',
        enum: ['Aquanqa 1', 'Aquanqa 2'],
        required: false
    })
    @IsString()
    @IsOptional()
    @IsIn(['Aquanqa 1', 'Aquanqa 2'], { message: 'empresa must be either Aquanqa 1 or Aquanqa 2' })
    empresa?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    id?: number;

    @ApiProperty({ required: false })
    @IsOptional()
    password?: string;
}
