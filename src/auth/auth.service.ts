import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async signIn(identifier: string, pass: string): Promise<any> {
        // Buscamos por email o DNI
        let user = await this.usersService.findOne({ email: identifier });
        if (!user) {
            user = await this.usersService.findOne({ dni: identifier });
        }

        if (!user || user.password !== pass) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const { password, ...result } = user;
        return result;
    }
}
