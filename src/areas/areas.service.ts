import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreasService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        return this.prisma.areas.findMany({
            select: {
                id: true,
                nombre: true,
                descripcion: true,
            },
            orderBy: {
                nombre: 'asc',
            },
        });
    }
}
