import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService,
    ) { }

    async signIn(identifier: string, pass: string, deviceData?: { deviceId?: string, deviceName?: string }): Promise<any> {
        // Buscamos por email o documento
        let user = await this.usersService.findOne({ email: identifier });
        if (!user) {
            user = await this.usersService.findOne({ documento: identifier });
        }

        if (!user || user.password !== pass) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const tokens = await this.getTokens(user.id, user.email, user.rol);

        // Guardar sesión en la DB
        await this.updateRefreshToken(user.id, tokens.refresh_token, deviceData);

        const { password, ...result } = user;
        const response = {
            ...tokens,
            user: result,
            data: {
                ...tokens,
                user: result,
            },
        };

        return response;
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<any> {
        const user = await this.usersService.findOne({ id: userId });
        if (!user) throw new UnauthorizedException('Acceso denegado');

        const session = await this.prisma.userSession.findFirst({
            where: {
                userId,
                isRevoked: false,
                expiresAt: { gt: new Date() },
            },
        });

        if (!session) throw new UnauthorizedException('Sesión no encontrada o expirada');

        // Validar hash
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        if (session.refreshTokenHash !== hash) throw new UnauthorizedException('Token inválido');

        const tokens = await this.getTokens(user.id, user.email, user.rol);
        await this.updateRefreshToken(user.id, tokens.refresh_token);

        return tokens;
    }

    private async getTokens(userId: number, email: string, rol: string) {
        const payload = { sub: userId, email, rol };
        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(payload, { expiresIn: '15m' }),
            this.jwtService.signAsync(payload, { expiresIn: '7d' }),
        ]);

        return {
            access_token: at,
            refresh_token: rt,
        };
    }

    private async updateRefreshToken(userId: number, refreshToken: string, deviceData?: any) {
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Para simplificar, manejamos una sesión por dispositivo o una sesión general
        await this.prisma.userSession.upsert({
            where: {
                userId_deviceId: {
                    userId,
                    deviceId: deviceData?.deviceId || 'default_web',
                },
            },
            update: {
                refreshTokenHash: hash,
                expiresAt,
                lastUsedAt: new Date(),
                deviceName: deviceData?.deviceName,
                isRevoked: false,
            },
            create: {
                userId,
                refreshTokenHash: hash,
                expiresAt,
                deviceId: deviceData?.deviceId || 'default_web',
                deviceName: deviceData?.deviceName,
            },
        });
    }
}
