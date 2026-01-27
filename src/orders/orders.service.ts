import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(userId: number, data: { description: string, amount?: number }) {
        return this.prisma.order.create({
            data: {
                userId,
                description: data.description,
                amount: data.amount,
            },
            include: {
                user: {
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
            this.prisma.order.findMany({
                include: {
                    user: {
                        select: {
                            nombre: true,
                            email: true,
                        }
                    }
                },
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc'
                }
            }),
            this.prisma.order.count(),
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

    async updateStatus(id: number, status: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}
