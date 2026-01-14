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
exports.JustificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let JustificationsService = class JustificationsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createJustificationDto) {
        const { adjunto_url, ...data } = createJustificationDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { area_id: true },
        });
        return this.prisma.justification.create({
            data: {
                ...data,
                fecha_evento: new Date(data.fecha_evento),
                usuario_id: userId,
                area_id: user?.area_id,
                attachments: adjunto_url
                    ? {
                        create: {
                            nombre_archivo: 'Adjunto de Justificación',
                            ruta_archivo: adjunto_url,
                            tipo_archivo: 'url',
                        },
                    }
                    : undefined,
            },
        });
    }
    async findAll(role, userId) {
        if (role === 'ADMIN' || role === 'GESTOR') {
            return this.prisma.justification.findMany({
                include: {
                    usuario: { select: { nombre: true, documento: true } },
                    area: { select: { nombre: true } },
                    attachments: true,
                },
            });
        }
        return this.prisma.justification.findMany({
            where: { usuario_id: userId },
            include: {
                attachments: true,
            },
        });
    }
    async updateStatus(id, adminId, statusDto) {
        const justification = await this.prisma.justification.findUnique({
            where: { id },
        });
        if (!justification) {
            throw new common_1.NotFoundException('Justificación no encontrada');
        }
        return this.prisma.justification.update({
            where: { id },
            data: {
                estado: statusDto.estado,
                razon_rechazo: statusDto.razon_rechazo,
                aprobado_por: adminId,
            },
        });
    }
};
exports.JustificationsService = JustificationsService;
exports.JustificationsService = JustificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], JustificationsService);
//# sourceMappingURL=justifications.service.js.map