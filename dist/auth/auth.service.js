"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async signIn(identifier, pass, deviceData) {
        let user = await this.usersService.findOne({ email: identifier });
        if (!user) {
            user = await this.usersService.findOne({ documento: identifier });
        }
        if (!user || user.password !== pass) {
            throw new common_1.UnauthorizedException('Credenciales incorrectas');
        }
        const tokens = await this.getTokens(user.id, user.email, user.rol);
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
    async refreshTokens(userId, refreshToken) {
        const user = await this.usersService.findOne({ id: userId });
        if (!user)
            throw new common_1.UnauthorizedException('Acceso denegado');
        const session = await this.prisma.userSession.findFirst({
            where: {
                userId,
                isRevoked: false,
                expiresAt: { gt: new Date() },
            },
        });
        if (!session)
            throw new common_1.UnauthorizedException('Sesión no encontrada o expirada');
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        if (session.refreshTokenHash !== hash)
            throw new common_1.UnauthorizedException('Token inválido');
        const tokens = await this.getTokens(user.id, user.email, user.rol);
        await this.updateRefreshToken(user.id, tokens.refresh_token);
        return tokens;
    }
    async getTokens(userId, email, rol) {
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
    async updateRefreshToken(userId, refreshToken, deviceData) {
        const hash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map