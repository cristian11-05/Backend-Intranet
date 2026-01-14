import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async create(createAreaDto: CreateAreaDto) {
    return this.prisma.area.create({
      data: createAreaDto,
    });
  }

  async findAll() {
    return this.prisma.area.findMany({
      include: {
        _count: {
          select: { users: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const area = await this.prisma.area.findUnique({
      where: { id },
    });

    if (!area) {
      throw new NotFoundException('Área no encontrada');
    }

    return area;
  }

  async update(id: string, updateAreaDto: CreateAreaDto) {
    await this.findOne(id);
    return this.prisma.area.update({
      where: { id },
      data: updateAreaDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.area.delete({
      where: { id },
    });
  }
}
