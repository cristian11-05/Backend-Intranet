import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
import * as fs from 'fs';
import * as path from 'path';

import { StorageService } from '../common/services/storage.service';

@Injectable()
export class ComunicadosService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService,
        private storageService: StorageService
    ) { }

    async create(data: any) {
        // Basic authorization check placeholder (since we don't have request context here easily without RequestRef, 
        // relying on Controller guard or passing user info)

        // Process image if it is Base64
        if (data.imagen && data.imagen.startsWith('data:image')) {
            data.imagen_url = await this.storageService.uploadBase64(data.imagen, 'comunicados');
            delete data.imagen;
        } else if (data.imagen) {
            data.imagen_url = data.imagen; // Assume it is URL
            delete data.imagen;
        }

        const comunicado = await this.prisma.comunicados.create({
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
        return this.prisma.comunicados.findMany({
            where: { activo: true },
            include: { users: true },
            orderBy: { fecha_publicacion: 'desc' }
        });
    }

    async findOne(id: number) {
        return this.prisma.comunicados.findUnique({
            where: { id },
            include: { users: true }
        });
    }

    async update(id: number, data: any) {
        if (data.imagen && data.imagen.startsWith('data:image')) {
            data.imagen_url = await this.storageService.uploadBase64(data.imagen, 'comunicados');
            delete data.imagen;
        }

        return this.prisma.comunicados.update({
            where: { id },
            data: {
                titulo: data.titulo,
                contenido: data.contenido,
                imagen_url: data.imagen_url,
                activo: data.activo
            },
            include: { users: true }
        });
    }

    async remove(id: number) {
        return this.prisma.comunicados.update({
            where: { id },
            data: { activo: false }
        });
    }

}
