import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({ example: 1, description: 'User ID' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 'jwt_refresh_token_here', description: 'The refresh token' })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
