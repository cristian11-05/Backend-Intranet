import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Username, Email or DNI',
        required: false
    })
    @IsString()
    @IsOptional()
    username?: string;

    @ApiProperty({
        example: 'user@example.com',
        description: 'User email',
        required: false
    })
    @IsString()
    @IsOptional()
    email?: string;

    @ApiProperty({
        example: '12345678',
        description: 'User DNI',
        required: false
    })
    @IsString()
    @IsOptional()
    dni?: string;

    @ApiProperty({ example: 'password123', description: 'User password' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'device_id_123', description: 'Unique device identifier', required: false })
    @IsString()
    @IsOptional()
    deviceId?: string;

    @ApiProperty({ example: 'iPhone 13', description: 'Human readable device name', required: false })
    @IsString()
    @IsOptional()
    deviceName?: string;
}
