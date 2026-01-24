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
exports.SuggestionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
let SuggestionsService = class SuggestionsService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(data) {
        return this.prisma.suggestion.create({
            data,
        });
    }
    async findAll() {
        return this.prisma.suggestion.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async findOne(id) {
        return this.prisma.suggestion.findUnique({
            where: { id },
            include: { user: true }
        });
    }
    async update(id, data) {
        const suggestion = await this.prisma.suggestion.update({
            where: { id },
            data,
            include: { user: true }
        });
        if (data.status === 'RECHAZADO' || data.status === 'APROBADO') {
            await this.notificationsService.notifyStatusChange(suggestion.userId, suggestion.type, data.status);
        }
        return suggestion;
    }
    async remove(id) {
        return this.prisma.suggestion.delete({
            where: { id },
        });
    }
};
exports.SuggestionsService = SuggestionsService;
exports.SuggestionsService = SuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], SuggestionsService);
//# sourceMappingURL=suggestions.service.js.map