import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { users as User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(where: Prisma.usersWhereInput): Promise<User | null> {
        return this.prisma.users.findFirst({
            where,
        });
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.users.findMany({
                skip,
                take: limit,
                orderBy: { fecha_registro: 'desc' }
            }),
            this.prisma.users.count(),
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async exportUsers(): Promise<string> {
        const { data: users } = await this.findAll(1, 10000);
        const headers = ['ID', 'Email', 'Nombre', 'Rol', 'Estado', 'Creado'];
        const csvRows = [headers.join(',')];

        for (const user of users) {
            const row = [
                user.id,
                user.email,
                user.nombre || '',
                user.rol || '',
                user.estado,
                user.fecha_registro?.toISOString() || ''
            ];
            csvRows.push(row.join(','));
        }
        return csvRows.join('\n');
    }

    async create(data: Prisma.usersCreateInput): Promise<User> {
        return this.prisma.users.create({
            data,
        });
    }

    async update(id: number, data: Prisma.usersUpdateInput): Promise<User> {
        return this.prisma.users.update({
            where: { id },
            data,
        });
    }

    async remove(id: number): Promise<User> {
        return this.prisma.users.update({
            where: { id },
            data: { estado: false }
        });
    }
}
