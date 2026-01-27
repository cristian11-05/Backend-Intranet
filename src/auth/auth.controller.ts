import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Login to the application' })
    @ApiResponse({ status: 200, description: 'Successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async signIn(@Body() loginDto: LoginDto) {
        console.log('Login attempt:', loginDto);
        const { username, email, dni, password, deviceId, deviceName } = loginDto;
        const identifier = username || email || dni;

        if (!identifier) {
            throw new UnauthorizedException('Se requiere usuario, email o dni');
        }

        try {
            const result = await this.authService.signIn(identifier, password, { deviceId, deviceName });
            console.log('Login success for:', identifier);
            return result;
        } catch (error) {
            console.error('Login failed:', error.message);
            throw error;
        }
    }

    @HttpCode(HttpStatus.OK)
    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token' })
    @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
    @ApiResponse({ status: 401, description: 'Refresh failed.' })
    async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
        try {
            return await this.authService.refreshTokens(refreshTokenDto.userId, refreshTokenDto.refreshToken);
        } catch (error) {
            throw new UnauthorizedException('Refresh failed');
        }
    }
}
