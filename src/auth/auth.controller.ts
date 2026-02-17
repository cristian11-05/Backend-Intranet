import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthGuard } from './auth.guard';

@ApiTags('Auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    // Ruta para aplicación móvil: POST /login
    @HttpCode(HttpStatus.OK)
    @Post('login')
    @ApiOperation({ summary: 'Login to the application (Mobile)' })
    @ApiResponse({ status: 200, description: 'Successfully logged in.' })
    @ApiResponse({ status: 401, description: 'Unauthorized.' })
    async signInMobile(@Body() loginDto: LoginDto) {
        console.log('Mobile login attempt:', loginDto);
        const { username, email, dni, password, deviceId, deviceName } = loginDto;
        const identifier = username || email || dni;

        if (!identifier) {
            throw new UnauthorizedException('Se requiere usuario, email o dni');
        }

        try {
            const result = await this.authService.signIn(identifier, password, { deviceId, deviceName });
            console.log('Mobile login success for:', identifier);
            return result;
        } catch (error) {
            console.error('Mobile login failed:', error.message);
            throw error;
        }
    }

    // Ruta para web admin: POST /auth/login
    @HttpCode(HttpStatus.OK)
    @Post('auth/login')
    @ApiOperation({ summary: 'Login to the application (Web)' })
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
    @Post('auth/token/refresh')
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

    @Get('auth/profile')
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'Return current user.' })
    async getProfile(@Req() req: any) {
        const user = await this.authService.getProfile(req.user.sub);
        return {
            status: true,
            data: user
        };
    }
}
