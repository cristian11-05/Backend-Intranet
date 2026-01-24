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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationsService = class NotificationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async sendPushNotification(userId, title, body) {
        const tokens = await this.prisma.deviceToken.findMany({
            where: { userId, isActive: true },
        });
        if (tokens.length === 0) {
            console.log(`[Notification] No active devices found for user ${userId}. Skipping push.`);
            return;
        }
        tokens.forEach(t => {
            console.log(`[Notification] Sending to device ${t.deviceName} (${t.token}):`);
            console.log(`   Title: ${title}`);
            console.log(`   Body: ${body}`);
        });
    }
    async notifyStatusChange(userId, type, status) {
        let title = 'Actualización de Estado';
        let body = `Su solicitud de ${type} ha sido actualizada a: ${status}`;
        if (status === 'RECHAZADO') {
            title = 'Solicitud Rechazada';
            body = `Su ${type} ha sido rechazado. Por favor revise los detalles.`;
        }
        else if (status === 'APROBADO') {
            title = 'Solicitud Aprobada';
            body = `Su ${type} ha sido aprobado exitosamente.`;
        }
        await this.sendPushNotification(userId, title, body);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map