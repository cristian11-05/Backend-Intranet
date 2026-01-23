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

    async findAll() {
        return this.prisma.order.findMany({
            include: {
                user: {
                    select: {
                        nombre: true,
                        email: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async updateStatus(id: number, status: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
}
