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
        // Buscamos por email o documento (DNI)
        const user = await this.prisma.users.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { documento: identifier }
                ]
            }
        });

        if (!user || user.contrasena !== pass) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const tokens = await this.getTokens(user.id, user.email, user.rol || 'empleado');

        // Guardar sesión en la DB
        await this.updateRefreshToken(user.id, tokens.refresh_token, deviceData);

        const { contrasena, ...result } = user;
        const response = {
            ...tokens,
            user: result,
        };

        return response;
    }

    async refreshTokens(userId: number, refreshToken: string): Promise<any> {
        const user = await this.usersService.findOne({ id: userId });
        if (!user) throw new UnauthorizedException('Acceso denegado');

        const session = await this.prisma.user_sessions.findFirst({
            where: {
                usuario_id: userId,
                is_revoked: false,
                expires_at: { gt: new Date() },
            },
        });

        if (!session) throw new UnauthorizedException('Sesión no encontrada o expirada');

        // Validar hash
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        if (session.refresh_token_hash !== hash) throw new UnauthorizedException('Token inválido');

        const tokens = await this.getTokens(user.id, user.email, user.rol || 'empleado');
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

    async updateRefreshToken(userId: number, refreshToken: string, deviceData?: any) {
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        // Para simplificar, manejamos una sesión por dispositivo o una sesión general
        await this.prisma.user_sessions.upsert({
            where: {
                usuario_id_device_id: {
                    usuario_id: userId,
                    device_id: deviceData?.deviceId || 'default_web',
                },
            },
            update: {
                refresh_token_hash: hash,
                expires_at: expiresAt,
                last_used_at: new Date(),
                device_name: deviceData?.deviceName,
                is_revoked: false,
            },
            create: {
                usuario_id: userId,
                refresh_token_hash: hash,
                expires_at: expiresAt,
                device_id: deviceData?.deviceId || 'default_web',
                device_name: deviceData?.deviceName,
            },
        });
    }

    async getProfile(userId: number) {
        const user = await this.usersService.findOne({ id: userId });
        if (!user) throw new UnauthorizedException('Usuario no encontrado');
        const { contrasena, ...result } = user as any;
        return result;
    }
}

