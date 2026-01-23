import { PrismaService } from '../prisma/prisma.service';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: number, data: {
        description: string;
        amount?: number;
    }): Promise<{
        user: {
            email: string;
            nombre: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
        status: string;
        amount: number | null;
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            nombre: string | null;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
        status: string;
        amount: number | null;
    })[]>;
    updateStatus(id: number, status: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
        status: string;
        amount: number | null;
    }>;
}
