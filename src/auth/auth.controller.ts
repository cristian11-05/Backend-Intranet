import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        console.log('Login attempt:', signInDto);
        const { username, email, dni, password, deviceId, deviceName } = signInDto;
        const identifier = username || email || dni;

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
    async refresh(@Body() body: { userId: number, refreshToken: string }) {
        try {
            return await this.authService.refreshTokens(body.userId, body.refreshToken);
        } catch (error) {
            throw new UnauthorizedException('Refresh failed');
        }
    }
}
