import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';

@Injectable()
export class SuggestionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateSuggestionDto) {
    const { adjunto_url, ...data } = createDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { area_id: true },
    });

    return this.prisma.suggestion.create({
      data: {
        ...data,
        usuario_id: userId,
        area_id: user?.area_id,
        attachments: adjunto_url
          ? {
              create: {
                nombre_archivo: 'Adjunto de Sugerencia',
                ruta_archivo: adjunto_url,
                tipo_archivo: 'url',
                tamano: 0,
              },
            }
          : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.suggestion.findMany({
      include: {
        usuario: { select: { nombre: true, rol: true } },
        area: { select: { nombre: true } },
        attachments: true,
      },
      orderBy: { fecha_creacion: 'desc' },
    });
  }
}
