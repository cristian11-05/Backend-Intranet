import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJustificationDto } from './dto/create-justification.dto';

@Injectable()
export class JustificationsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createJustificationDto: CreateJustificationDto) {
        const { usuario_id, area_id, titulo, descripcion, fecha_evento, hora_inicio, hora_fin } = createJustificationDto;

        const sql = `
      INSERT INTO justifications (usuario_id, area_id, titulo, descripcion, fecha_evento, hora_inicio, hora_fin)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

        const result = await (this.prisma as any).$queryRawUnsafe(
            sql,
            usuario_id,
            area_id,
            titulo,
            descripcion,
            new Date(fecha_evento),
            hora_inicio,
            hora_fin
        );

        return result[0];
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const dataSql = `
      SELECT j.*, u.nombre as usuario_nombre, a.nombre as area_nombre
      FROM justifications j
      LEFT JOIN users u ON j.usuario_id = u.id
      LEFT JOIN areas a ON j.area_id = a.id
      ORDER BY j.fecha_creacion DESC
      LIMIT $1 OFFSET $2
    `;

        const countSql = `SELECT COUNT(*) FROM justifications`;

        const [data, [{ count }]] = await Promise.all([
            (this.prisma as any).$queryRawUnsafe(dataSql, limit, skip),
            (this.prisma as any).$queryRawUnsafe(countSql),
        ]);

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

    async updateStatus(id: number, status: string, approvedBy?: number) {
        const sql = `
      UPDATE justifications 
      SET estado = $1, aprobado_por = $2, fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
        const result = await (this.prisma as any).$queryRawUnsafe(sql, status, approvedBy, id);
        return result[0];
    }
}
