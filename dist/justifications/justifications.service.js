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
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let JustificationsService = class JustificationsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(data) {
        return this.prisma.justification.create({
            data,
        });
    }
    async findAll() {
        return this.prisma.justification.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        return this.prisma.justification.findUnique({
            where: { id },
            include: { user: true }
        });
    }
    async update(id, data) {
        const justification = await this.prisma.justification.update({
            where: { id },
            data,
            include: { user: true }
        });
        if (data.status === 'RECHAZADO' || data.status === 'APROBADO') {
            const typeLabel = justification.type === 'INASISTENCIA' ? 'Solicitud de Inasistencia' : 'Solicitud de Permiso';
            await this.notificationsService.notifyStatusChange(justification.userId, typeLabel, data.status);
        }
        return justification;
    }
    async remove(id) {
        return this.prisma.justification.delete({
            where: { id },
        });
    }
};
exports.JustificationsService = JustificationsService;
exports.JustificationsService = JustificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], JustificationsService);
//# sourceMappingURL=justifications.service.js.map