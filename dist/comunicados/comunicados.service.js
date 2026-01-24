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
exports.ComunicadosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const notifications_service_1 = require("../notifications/notifications.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ComunicadosService = class ComunicadosService {
    prisma;
    notificationsService;
    constructor(prisma, notificationsService) {
        this.prisma = prisma;
        this.notificationsService = notificationsService;
    }
    async create(data) {
        if (data.imagen && data.imagen.startsWith('data:image')) {
            data.imagen_url = this.saveBase64Image(data.imagen);
            delete data.imagen;
        }
        else if (data.imagen) {
            data.imagen_url = data.imagen;
            delete data.imagen;
        }
        const comunicado = await this.prisma.comunicado.create({
            data: {
                titulo: data.titulo,
                contenido: data.contenido,
                imagen_url: data.imagen_url,
                autor_id: data.autor_id,
                activo: data.activo ?? true
            },
        });
        return comunicado;
    }
    async findAll() {
        return this.prisma.comunicado.findMany({
            where: { activo: true },
            include: { autor: true },
            orderBy: { fecha_publicacion: 'desc' }
        });
    }
    async findOne(id) {
        return this.prisma.comunicado.findUnique({
            where: { id },
            include: { autor: true }
        });
    }
    async update(id, data) {
        if (data.imagen && data.imagen.startsWith('data:image')) {
            data.imagen_url = this.saveBase64Image(data.imagen);
            delete data.imagen;
        }
        return this.prisma.comunicado.update({
            where: { id },
            data: {
                titulo: data.titulo,
                contenido: data.contenido,
                imagen_url: data.imagen_url,
                activo: data.activo
            },
            include: { autor: true }
        });
    }
    async remove(id) {
        return this.prisma.comunicado.update({
            where: { id },
            data: { activo: false }
        });
    }
    saveBase64Image(base64Str) {
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return null;
        }
        const type = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const extension = type.split('/')[1];
        const fileName = `announcement-${Date.now()}.${extension}`;
        const uploadDir = path.join(__dirname, '..', '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        fs.writeFileSync(path.join(uploadDir, fileName), buffer);
        return `/uploads/${fileName}`;
    }
};
exports.ComunicadosService = ComunicadosService;
exports.ComunicadosService = ComunicadosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        notifications_service_1.NotificationsService])
], ComunicadosService);
//# sourceMappingURL=comunicados.service.js.map