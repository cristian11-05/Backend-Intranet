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

        const sql = `
      INSERT INTO justifications (usuario_id, area_id, titulo, descripcion, fecha_evento, hora_inicio, hora_fin, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendiente')
      RETURNING *
    `;

        const result = await (this.prisma as any).$queryRawUnsafe(sql, usuario_id, area_id, titulo, descripcion, new Date(fecha_evento), hora_inicio, hora_fin);
        const justification = result[0];

        if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
                const attachSql = `INSERT INTO justification_attachments (justification_id, ruta_archivo, tipo_archivo) VALUES ($1, $2, $3)`;
                await (this.prisma as any).$queryRawUnsafe(attachSql, justification.id, attachment.ruta_archivo, attachment.tipo_archivo);
            }
        }

        // Fetch detailed info and attachments
        const detailedSql = `
            SELECT j.*, u.nombre as usuario_nombre, u.email as usuario_email, a.nombre as area_nombre
            FROM justifications j
            LEFT JOIN users u ON j.usuario_id = u.id
            LEFT JOIN areas a ON j.area_id = a.id
            WHERE j.id = $1
        `;
        const detailedResult = await (this.prisma as any).$queryRawUnsafe(detailedSql, justification.id);
        const justificationDetailed = detailedResult[0];

        const attachmentsSql = `SELECT id, ruta_archivo, tipo_archivo FROM justification_attachments WHERE justification_id = $1`;
        const adjuntos = await (this.prisma as any).$queryRawUnsafe(attachmentsSql, justification.id);

        return {
            ...justificationDetailed,
            user: {
                nombre: justificationDetailed.usuario_nombre,
                email: justificationDetailed.usuario_email
            },
            adjunto_url: adjuntos && adjuntos.length > 0 ? adjuntos[0].ruta_archivo : null,
            adjuntos: adjuntos || []
        };
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const dataSql = `
      SELECT j.*, u.nombre as usuario_nombre, u.email as usuario_email, a.nombre as area_nombre,
             admin.nombre as aprobado_por_nombre
      FROM justifications j
      LEFT JOIN users u ON j.usuario_id = u.id
      LEFT JOIN areas a ON j.area_id = a.id
      LEFT JOIN users admin ON j.aprobado_por = admin.id
      ORDER BY j.fecha_creacion DESC
      LIMIT $1 OFFSET $2
    `;

        const countSql = `SELECT COUNT(*) FROM justifications`;

        const [rawResults, [{ count }]] = await Promise.all([
            (this.prisma as any).$queryRawUnsafe(dataSql, limit, skip),
            (this.prisma as any).$queryRawUnsafe(countSql),
        ]);

        const data = await Promise.all((rawResults as any[]).map(async item => {
            const attachmentsSql = `SELECT id, ruta_archivo, tipo_archivo FROM justification_attachments WHERE justification_id = $1`;
            const adjuntos = await (this.prisma as any).$queryRawUnsafe(attachmentsSql, item.id);

            return {
                ...item,
                usuario_nombre: item.usuario_nombre, // Explícito para el front
                area_nombre: item.area_nombre, // Explícito para el front
                user: {
                    nombre: item.usuario_nombre,
                    email: item.usuario_email
                },
                adjunto_url: adjuntos && adjuntos.length > 0 ? adjuntos[0].ruta_archivo : null,
                adjuntos: adjuntos || []
            };
        }));

        return {
            data,
            meta: {
                total: parseInt(count),
                page,
                limit,
                totalPages: Math.ceil(parseInt(count) / limit),
            }
        };
    }

    async updateStatus(id: number, status: string, approvedBy?: number, rejectionReason?: string) {
        // Normalización para consistencia interna (v3) - Usamos masculino como estándar para el front
        let normalizedStatus = status.toLowerCase();
        if (normalizedStatus === 'aprobada') normalizedStatus = 'aprobado';
        if (normalizedStatus === 'rechazada') normalizedStatus = 'rechazado';

        if (normalizedStatus === 'rechazado' && !rejectionReason) {
            throw new BadRequestException('La razón de rechazo es obligatoria para el estado rechazado');
        }

        const sql = `
            UPDATE justifications 
            SET estado = $1, aprobado_por = $2, razon_rechazo = $3, fecha_actualizacion = NOW()
            WHERE id = $4
            RETURNING *
        `;
        const result = await (this.prisma as any).$queryRawUnsafe(sql, normalizedStatus, approvedBy || null, rejectionReason || null, id);
        const justification = result[0];

        if (justification) {
            let title = 'Actualización de Justificación';
            let body = `Tu justificación "${justification.titulo}" ha sido marcada como: ${status}`;

            if (normalizedStatus === 'aprobado') {
                title = 'Justificación Aprobada';
                body = `Tu justificación "${justification.titulo}" ha sido aprobada.`;
            } else if (normalizedStatus === 'rechazado') {
                title = 'Justificación Rechazada';
                body = `Tu justificación "${justification.titulo}" ha sido rechazada. Motivo: ${rejectionReason}`;
            }

            await this.notificationsService.sendPushNotification(justification.usuario_id, title, body);
        }

        // Fetch detailed info and attachments
        const detailedSql = `
            SELECT j.*, u.nombre as usuario_nombre, u.email as usuario_email, a.nombre as area_nombre
            FROM justifications j
            LEFT JOIN users u ON j.usuario_id = u.id
            LEFT JOIN areas a ON j.area_id = a.id
            WHERE j.id = $1
        `;
        const detailedResult = await (this.prisma as any).$queryRawUnsafe(detailedSql, id);
        const justificationDetailed = detailedResult[0];

        const attachmentsSql = `SELECT id, ruta_archivo, tipo_archivo FROM justification_attachments WHERE justification_id = $1`;
        const adjuntos = await (this.prisma as any).$queryRawUnsafe(attachmentsSql, id);

        return {
            ...justificationDetailed,
            user: {
                nombre: justificationDetailed.usuario_nombre,
                email: justificationDetailed.usuario_email
            },
            adjunto_url: adjuntos && adjuntos.length > 0 ? adjuntos[0].ruta_archivo : null,
            adjuntos: adjuntos || []
        };
    }
}
