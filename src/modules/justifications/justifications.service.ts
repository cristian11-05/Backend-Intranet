import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateJustificationDto,
  UpdateJustificationStatusDto,
} from './dto/create-justification.dto';

@Injectable()
export class JustificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createJustificationDto: CreateJustificationDto) {
    const { adjunto_url, ...data } = createJustificationDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { area_id: true },
    });

    return this.prisma.justification.create({
      data: {
        ...data,
        fecha_evento: new Date(data.fecha_evento),
        usuario_id: userId,
        area_id: user?.area_id,
        attachments: adjunto_url
          ? {
              create: {
                nombre_archivo: 'Adjunto de Justificación',
                ruta_archivo: adjunto_url,
                tipo_archivo: 'url',
              },
            }
          : undefined,
      },
    });
  }

  async findAll(role: string, userId: string) {
    if (role === 'ADMIN' || role === 'GESTOR') {
      return this.prisma.justification.findMany({
        include: {
          usuario: { select: { nombre: true, documento: true } },
          area: { select: { nombre: true } },
          attachments: true,
        },
      });
    }

    return this.prisma.justification.findMany({
      where: { usuario_id: userId },
      include: {
        attachments: true,
      },
    });
  }

  async updateStatus(
    id: string,
    adminId: string,
    statusDto: UpdateJustificationStatusDto,
  ) {
    const justification = await this.prisma.justification.findUnique({
      where: { id },
    });

    if (!justification) {
      throw new NotFoundException('Justificación no encontrada');
    }

    return this.prisma.justification.update({
      where: { id },
      data: {
        estado: statusDto.estado as any,
        razon_rechazo: statusDto.razon_rechazo,
        aprobado_por: adminId,
      },
    });
  }
}
