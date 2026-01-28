import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Injectable()
export class SuggestionsService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createSuggestionDto: CreateSuggestionDto) {
        const { usuario_id, area_id, tipo, titulo, descripcion } = createSuggestionDto;

        // Using raw SQL to avoid Prisma Client sync issues with new tables
        const sql = `
      INSERT INTO suggestions (usuario_id, area_id, tipo, titulo, descripcion)
      VALUES ($1, $2, $3, $4, $5)
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
      SELECT s.*, u.nombre as usuario_nombre, a.nombre as area_nombre
      FROM suggestions s
      LEFT JOIN users u ON s.usuario_id = u.id
      LEFT JOIN areas a ON s.area_id = a.id
      ORDER BY s.fecha_creacion DESC
      LIMIT $1 OFFSET $2
    `;

        const countSql = `SELECT COUNT(*) FROM suggestions`;

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
}
