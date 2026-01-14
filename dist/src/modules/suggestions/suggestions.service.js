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
const prisma_service_1 = require("../../prisma/prisma.service");
let SuggestionsService = class SuggestionsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createDto) {
        const { adjunto_url, ...data } = createDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { area_id: true },
        });
        return this.prisma.suggestion.create({
            data: {
                ...data,
                usuario_id: userId,
                area_id: user?.area_id,
                attachments: adjunto_url
                    ? {
                        create: {
                            nombre_archivo: 'Adjunto de Sugerencia',
                            ruta_archivo: adjunto_url,
                            tipo_archivo: 'url',
                            tamano: 0,
                        },
                    }
                    : undefined,
            },
        });
    }
    async findAll() {
        return this.prisma.suggestion.findMany({
            include: {
                usuario: { select: { nombre: true, rol: true } },
                area: { select: { nombre: true } },
                attachments: true,
            },
            orderBy: { fecha_creacion: 'desc' },
        });
    }
};
exports.SuggestionsService = SuggestionsService;
exports.SuggestionsService = SuggestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SuggestionsService);
//# sourceMappingURL=suggestions.service.js.map