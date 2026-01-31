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

    async create(createSuggestionDto: CreateSuggestionDto) {
        const { usuario_id, area_id, tipo, titulo, descripcion } = createSuggestionDto;

        // Using raw SQL to avoid Prisma Client sync issues with new tables
        const sql = `
      INSERT INTO suggestions (usuario_id, area_id, tipo, titulo, descripcion, estado)
      VALUES ($1, $2, $3, $4, $5, 'pendiente')
      RETURNING *
    `;

        const result = await (this.prisma as any).$queryRawUnsafe(
            sql,
            usuario_id,
            area_id,
            tipo,
            titulo,
            descripcion
        );

        return result[0];
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

        const data = (rawResults as any[]).map(item => ({
            ...item,
            user: {
                nombre: item.usuario_nombre,
                email: item.usuario_email
            },
            revisado_por_user: item.revisado_por_nombre ? {
                nombre: item.revisado_por_nombre
            } : null
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

    async updateStatus(id: number, state: string, adminId: number, comment?: string) {
        const sql = `
            UPDATE suggestions 
            SET estado = $1, 
                comentario_admin = $2, 
                revisado_por = $3, 
                fecha_revision = NOW(), 
                fecha_actualizacion = NOW()
            WHERE id = $4
            RETURNING *
        `;

        const result = await (this.prisma as any).$queryRawUnsafe(sql, state, adminId, comment || null, id);

        const suggestion = result[0];

        if (suggestion && state === 'revisada') {
            await this.notificationsService.sendPushNotification(
                suggestion.usuario_id,
                'Sugerencia Revisada',
                'Tu sugerencia ha sido leída por la administración. ¡Gracias por participar!'
            );
        }

        return suggestion;
    }
}
