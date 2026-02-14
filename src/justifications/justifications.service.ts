import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJustificationDto } from './dto/create-justification.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class JustificationsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService
    ) { }

    async create(createJustificationDto: CreateJustificationDto, attachments?: { ruta_archivo: string, tipo_archivo: string }[]) {
        const { usuario_id, area_id, titulo, descripcion, fecha_evento, hora_inicio, hora_fin } = createJustificationDto;

        const [justification, areas] = await Promise.all([
            this.prisma.justifications.create({
                data: {
                    usuario_id,
                    area_id,
                    titulo,
                    descripcion,
                    fecha_evento: new Date(fecha_evento),
                    hora_inicio,
                    hora_fin,
                    estado: 0,
                    adjuntos: {
                        create: attachments || []
                    }
                },
                include: {
                    users: { select: { nombre: true, email: true } },
                    approver: { select: { nombre: true } },
                    adjuntos: true
                }
            }),
            this.prisma.areas.findMany()
        ]);

        return this.mapJustification(justification, areas);
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [justifications, total, areas] = await Promise.all([
            this.prisma.justifications.findMany({
                skip,
                take: limit,
                include: {
                    users: { select: { nombre: true, email: true } },
                    approver: { select: { nombre: true } },
                    adjuntos: true
                },
                orderBy: { fecha_creacion: 'desc' }
            }),
            this.prisma.justifications.count(),
            this.prisma.areas.findMany()
        ]);

        const data = justifications.map(j => this.mapJustification(j, areas));

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async updateStatus(id: number, status: number, approvedBy?: number, rejectionReason?: string) {
        // status: 0=pendiente, 1=aprobado, 2=rechazado
        if (status === 2 && !rejectionReason) {
            throw new BadRequestException('La razón de rechazo es obligatoria para el estado rechazado');
        }

        // 1. Perform update
        const justification = await this.prisma.justifications.update({
            where: { id },
            data: {
                estado: status,
                aprobado_por: approvedBy,
                razon_rechazo: rejectionReason || null,
                fecha_actualizacion: new Date()
            },
            include: {
                users: { select: { nombre: true, email: true } },
                approver: { select: { nombre: true } },
                adjuntos: true
            }
        });

        if (justification) {
            let title = 'Actualización de Justificación';
            let body = `Tu justificación "${justification.titulo}" ha sido actualizada.`;

            if (status === 1) {
                title = 'Justificación Aprobada';
                body = `Tu justificación "${justification.titulo}" ha sido aprobada.`;
            } else if (status === 2) {
                title = 'Justificación Rechazada';
                body = `Tu justificación "${justification.titulo}" ha sido rechazada. Motivo: ${rejectionReason}`;
            }

            try {
                await this.notificationsService.sendPushNotification(justification.usuario_id, title, body);
            } catch (e) {
                console.error('Error sending push notification for justification:', e);
            }
        }

        return this.getDetailedJustification(id);
    }

    private async getDetailedJustification(id: number) {
        const [justification, areas] = await Promise.all([
            this.prisma.justifications.findUnique({
                where: { id },
                include: {
                    users: { select: { nombre: true, email: true } },
                    approver: { select: { nombre: true } },
                    adjuntos: true
                }
            }),
            this.prisma.areas.findMany()
        ]);

        if (!justification) return null;
        return this.mapJustification(justification, areas);
    }

    private mapJustification(j: any, areas: any[]) {
        const area = areas.find(a => a.id === j.area_id);
        const mapped = {
            ...j,
            usuario_nombre: j.users?.nombre || null,
            usuario_email: j.users?.email || null,
            area_nombre: area?.nombre || null,
            aprobado_por_nombre: j.approver?.nombre || null,
            user: {
                nombre: j.users?.nombre || null,
                email: j.users?.email || null
            },
            adjunto_url: j.adjuntos && j.adjuntos.length > 0 ? j.adjuntos[0].ruta_archivo : null,
            adjuntos: j.adjuntos || []
        };

        // Remove Prisma objects to match legacy structure
        delete mapped.users;
        delete mapped.areas;
        delete mapped.approver;

        return mapped;
    }
}
