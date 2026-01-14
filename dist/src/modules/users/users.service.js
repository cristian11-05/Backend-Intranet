"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt_service_1 = require("../auth/bcrypt.service");
let UsersService = class UsersService {
    constructor(prisma, bcryptService) {
        this.prisma = prisma;
        this.bcryptService = bcryptService;
    }
    async create(createUserDto) {
        const { documento, email, contrasena, ...rest } = createUserDto;
        const existingUser = await this.prisma.user.findFirst({
            where: {
                OR: [{ documento }, { email }],
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El documento o email ya se encuentra registrado');
        }
        const hashedPassword = await this.bcryptService.hash(contrasena);
        return this.prisma.user.create({
            data: {
                ...rest,
                documento,
                email,
                contrasena: hashedPassword,
            },
            select: {
                id: true,
                documento: true,
                nombre: true,
                email: true,
                rol: true,
                estado: true,
                area_id: true,
                fecha_registro: true,
            },
        });
    }
    async findAll(role, areaId) {
        return this.prisma.user.findMany({
            where: {
                AND: [
                    role ? { rol: role } : {},
                    areaId ? { area_id: areaId } : {},
                ],
            },
            select: {
                id: true,
                documento: true,
                nombre: true,
                email: true,
                rol: true,
                estado: true,
                area: {
                    select: {
                        nombre: true,
                    },
                },
            },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                area: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const { contrasena, ...result } = user;
        return result;
    }
    async updateEstado(id, estado) {
        return this.prisma.user.update({
            where: { id },
            data: { estado },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bcrypt_service_1.BcryptService])
], UsersService);
//# sourceMappingURL=users.service.js.map