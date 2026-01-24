import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class JustificationsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async create(data: Prisma.JustificationCreateInput) {
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

    async findOne(id: number) {
        return this.prisma.justification.findUnique({
            where: { id },
            include: { user: true }
        });
    }

    async update(id: number, data: Prisma.JustificationUpdateInput) {
        const justification = await this.prisma.justification.update({
            where: { id },
            data,
            include: { user: true }
        });

        if (data.status === 'RECHAZADO' || data.status === 'APROBADO') {
            const typeLabel = justification.type === 'INASISTENCIA' ? 'Solicitud de Inasistencia' : 'Solicitud de Permiso';
            await this.notificationsService.notifyStatusChange(justification.userId, typeLabel, data.status as string);
        }

        return justification;
    }

    async remove(id: number) {
        return this.prisma.justification.delete({
            where: { id },
        });
    }
}
