import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(where: Prisma.UserWhereInput): Promise<User | null> {
        return this.prisma.user.findFirst({
            where,
        });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            where: { estado: { not: 'Inactivo' } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async exportUsers(): Promise<string> {
        const users = await this.findAll();
        const headers = ['ID', 'Documento', 'Email', 'Nombre', 'Rol', 'Estado', 'Creado'];
        const csvRows = [headers.join(',')];

        for (const user of users) {
            const row = [
                user.id,
                user.documento || '',
                user.email,
                user.nombre || '',
                user.rol,
                user.estado,
                user.createdAt.toISOString()
            ];
            csvRows.push(row.join(','));
        }
        return csvRows.join('\n');
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        return this.prisma.user.create({
            data,
        });
    }

    async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data: { estado: 'Inactivo' }
        });
    }
}
