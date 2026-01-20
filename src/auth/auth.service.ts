import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signIn(identifier: string, pass: string): Promise<any> {
        // Buscamos por email o DNI
        let user = await this.usersService.findOne({ email: identifier });
        if (!user) {
            user = await this.usersService.findOne({ dni: identifier });
        }

        if (!user || user.password !== pass) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const { password, ...result } = user;
        const access_token = await this.jwtService.signAsync(payload);

        const response = {
            access_token,
            token: access_token,
            user: result,
            data: {
                access_token,
                token: access_token,
                user: result,
            },
        };

        console.log('Returning auth response:', JSON.stringify(response, null, 2));
        return response;
    }
}
