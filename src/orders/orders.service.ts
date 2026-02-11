import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { orders as Order } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: number, data: { description: string, amount?: number }) {
        return this.prisma.orders.create({
            data: {
                usuario_id: userId,
                descripcion: data.description,
                monto: data.amount,
            },
            include: {
                users: {
                    select: {
                        nombre: true,
                        email: true,
                    }
                }
            }
        });
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.orders.findMany({
                include: {
                    users: {
                        select: {
                            nombre: true,
                            email: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    fecha_creacion: 'desc'
                }
            }),
            this.prisma.orders.count(),
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

    async updateStatus(id: number, status: number) {
        return this.prisma.orders.update({
            where: { id },
            data: { estado: status },
        });
    }
}
