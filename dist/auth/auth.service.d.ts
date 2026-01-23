import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    signIn(identifier: string, pass: string, deviceData?: {
        deviceId?: string;
        deviceName?: string;
    }): Promise<any>;
    refreshTokens(userId: number, refreshToken: string): Promise<any>;
    private getTokens;
    private updateRefreshToken;
}
