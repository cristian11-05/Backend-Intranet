import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        console.log('Login attempt:', signInDto);
        try {
            const result = await this.authService.signIn(signInDto.username || signInDto.email || signInDto.dni, signInDto.password);
            console.log('Login success for:', signInDto.username || signInDto.email || signInDto.dni);
            return result;
        } catch (error) {
            console.error('Login failed:', error.message);
            throw error;
        }
    }
}
