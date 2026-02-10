import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SuggestionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService
    ) { }

    async create(createSuggestionDto: CreateSuggestionDto, attachments?: { ruta_archivo: string, tipo_archivo: string }[]) {
        const { usuario_id, area_id, tipo, titulo, descripcion } = createSuggestionDto;

        const sql = `
      INSERT INTO suggestions (usuario_id, area_id, tipo, titulo, descripcion, estado)
      VALUES ($1, $2, $3, $4, $5, 0)
      RETURNING *
    `;

        const result = await (this.prisma as any).$queryRawUnsafe(sql, usuario_id, area_id, tipo, titulo, descripcion);
        const suggestion = result[0];

        if (attachments && attachments.length > 0) {
            for (const attachment of attachments) {
                const attachSql = `INSERT INTO suggestion_attachments (suggestion_id, ruta_archivo, tipo_archivo) VALUES ($1, $2, $3)`;
                await (this.prisma as any).$queryRawUnsafe(attachSql, suggestion.id, attachment.ruta_archivo, attachment.tipo_archivo);
            }
        }

        // Fetch user and area names for consistency
        const detailedSql = `
            SELECT s.*, u.nombre as usuario_nombre, u.email as usuario_email, a.nombre as area_nombre
            FROM suggestions s
            LEFT JOIN users u ON s.usuario_id = u.id
            LEFT JOIN areas a ON s.area_id = a.id
            WHERE s.id = $1
        `;
        const detailedResult = await (this.prisma as any).$queryRawUnsafe(detailedSql, suggestion.id);
        const suggestionDetailed = detailedResult[0];

        const attachmentsSql = `SELECT id, ruta_archivo, tipo_archivo FROM suggestion_attachments WHERE suggestion_id = $1`;
        const adjuntos = await (this.prisma as any).$queryRawUnsafe(attachmentsSql, suggestion.id);

        return {
            ...suggestionDetailed,
            user: {
                nombre: suggestionDetailed.usuario_nombre,
                email: suggestionDetailed.usuario_email
            },
            revisado_por_user: null, // New suggestion
            adjunto_url: adjuntos && adjuntos.length > 0 ? adjuntos[0].ruta_archivo : null,
            adjuntos: adjuntos || []
        };
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const dataSql = `
      SELECT s.*, u.nombre as usuario_nombre, u.email as usuario_email, a.nombre as area_nombre,
             admin.nombre as revisado_por_nombre
      FROM suggestions s
      LEFT JOIN users u ON s.usuario_id = u.id
      LEFT JOIN areas a ON s.area_id = a.id
      LEFT JOIN users admin ON s.revisado_por = admin.id
      ORDER BY s.fecha_creacion DESC
      LIMIT $1 OFFSET $2
    `;

        const countSql = `SELECT COUNT(*) FROM suggestions`;

        const [rawResults, [{ count }]] = await Promise.all([
            (this.prisma as any).$queryRawUnsafe(dataSql, limit, skip),
            (this.prisma as any).$queryRawUnsafe(countSql),
        ]);

        const suggestions = rawResults as any[];
        const ids = suggestions.map(s => s.id);

        let allAttachments: any[] = [];
        if (ids.length > 0) {
            const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
            const attachmentsSql = `SELECT id, suggestion_id, ruta_archivo, tipo_archivo FROM suggestion_attachments WHERE suggestion_id IN (${placeholders})`;
            allAttachments = await (this.prisma as any).$queryRawUnsafe(attachmentsSql, ...ids);
        }

        const data = suggestions.map(item => {
            const adjuntos = allAttachments.filter(a => a.suggestion_id === item.id);

            return {
                ...item,
                usuario_nombre: item.usuario_nombre,
                area_nombre: item.area_nombre,
                user: {
                    nombre: item.usuario_nombre,
                    email: item.usuario_email
                },
                revisado_por_user: item.revisado_por_nombre ? {
                    nombre: item.revisado_por_nombre
                } : null,
                adjunto_url: adjuntos.length > 0 ? adjuntos[0].ruta_archivo : null,
                adjuntos: adjuntos
            };
        });

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

    async updateStatus(id: number, state: number, adminId: number, comment?: string) {
        // state: 0=pendiente, 1=revisada
        const sql = `
            UPDATE suggestions 
            SET estado = $1, comentario_admin = $2, revisado_por = $3, fecha_revision = NOW(), fecha_actualizacion = NOW()
            WHERE id = $4
            RETURNING *
        `;

        const result = await (this.prisma as any).$queryRawUnsafe(sql, state, comment || null, adminId, id);
        const suggestion = result[0];

        if (suggestion && state === 1) {
            await this.notificationsService.sendPushNotification(
                suggestion.usuario_id,
                'Sugerencia Revisada',
                'Tu sugerencia ha sido leída por la administración. ¡Gracias por participar!'
            );
        }

        // Fetch detailed info and attachments
        const detailedSql = `
            SELECT s.*, u.nombre as usuario_nombre, u.email as usuario_email, a.nombre as area_nombre,
                   admin.nombre as revisado_por_nombre
            FROM suggestions s
            LEFT JOIN users u ON s.usuario_id = u.id
            LEFT JOIN areas a ON s.area_id = a.id
            LEFT JOIN users admin ON s.revisado_por = admin.id
            WHERE s.id = $1
        `;
        const detailedResult = await (this.prisma as any).$queryRawUnsafe(detailedSql, id);
        const suggestionDetailed = detailedResult[0];

        const attachmentsSql = `SELECT id, ruta_archivo, tipo_archivo FROM suggestion_attachments WHERE suggestion_id = $1`;
        const adjuntos = await (this.prisma as any).$queryRawUnsafe(attachmentsSql, id);

        return {
            ...suggestionDetailed,
            user: {
                nombre: suggestionDetailed.usuario_nombre,
                email: suggestionDetailed.usuario_email
            },
            revisado_por_user: suggestionDetailed.revisado_por_nombre ? {
                nombre: suggestionDetailed.revisado_por_nombre
            } : null,
            adjunto_url: adjuntos && adjuntos.length > 0 ? adjuntos[0].ruta_archivo : null,
            adjuntos: adjuntos || []
        };
    }
}
