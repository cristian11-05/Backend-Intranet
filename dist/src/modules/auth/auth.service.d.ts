import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { BcryptService } from './bcrypt.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private bcryptService;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, bcryptService: BcryptService, jwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        refresh_token: string;
        user: {
            id: string;
            nombre: string;
            email: string;
            rol: import(".prisma/client").$Enums.Role;
            documento: string;
        };
    }>;
}
