import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ComunicadosService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async create(data: any) {
        // Basic authorization check placeholder (since we don't have request context here easily without RequestRef, 
        // relying on Controller guard or passing user info)

        // Process image if it is Base64
        if (data.imagen && data.imagen.startsWith('data:image')) {
            data.imagen_url = this.saveBase64Image(data.imagen);
            delete data.imagen; // Remove base64 string from DTO to avoid DB error if using loose types, or just for cleanup
        } else if (data.imagen) {
            data.imagen_url = data.imagen; // Assume it is URL
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

        // Notify all users (Mass notification)
        // We would need a method in NotificationsService to broadcast.
        // For now, let's log it or iterate if not too many users.
        // Ideally: await this.notificationsService.broadcast(...)

        return comunicado;
    }

    async findAll() {
        return this.prisma.comunicado.findMany({
            where: { activo: true },
            include: { autor: true },
            orderBy: { fecha_publicacion: 'desc' }
        });
    }

    async findOne(id: number) {
        return this.prisma.comunicado.findUnique({
            where: { id },
            include: { autor: true }
        });
    }

    async update(id: number, data: any) {
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

    async remove(id: number) {
        return this.prisma.comunicado.update({
            where: { id },
            data: { activo: false }
        });
    }

    private saveBase64Image(base64Str: string): string | null {
        // Simple Base64 saver
        const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return null;
        }

        const type = matches[1];
        const buffer = Buffer.from(matches[2], 'base64');
        const extension = type.split('/')[1];
        const fileName = `announcement-${Date.now()}.${extension}`;
        const uploadDir = path.join(__dirname, '..', '..', 'uploads'); // Check relative path

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        fs.writeFileSync(path.join(uploadDir, fileName), buffer);
        return `/uploads/${fileName}`; // Return relative URL
    }
}
