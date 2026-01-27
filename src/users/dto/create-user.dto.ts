import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: '12345678', description: 'User document number' })
    @IsString()
    @IsOptional() // Logic says optional because sometimes it's auto-generated or handled differently, but let's check controller logic. Controller says if !password && documento, use documento.
    documento?: string;

    @ApiProperty({ example: 'user@example.com', description: 'User email' })
    @IsEmail()
    @IsOptional() // Controller logic implies email can be generated from documento
    email?: string;

    @ApiProperty({ example: 'password123', description: 'User password', required: false })
    @IsString()
    @MinLength(6)
    @IsOptional() // Controller sets default if missing
    password?: string;

    @ApiProperty({ example: 'John Doe', description: 'User full name', required: false })
    @IsString()
    @IsOptional()
    nombre?: string;

    @ApiProperty({ example: 'empleado', description: 'User role', default: 'empleado' })
    @IsString()
    @IsOptional()
    rol?: string;

    @ApiProperty({ example: 'IT', description: 'Area ID', required: false })
    @IsString()
    @IsOptional()
    area_id?: string;

    @ApiProperty({ example: 'Activo', description: 'User status', default: 'Activo' })
    @IsString()
    @IsOptional()
    estado?: string;
}
