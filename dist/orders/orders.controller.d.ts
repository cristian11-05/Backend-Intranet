import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(body: {
        userId: number;
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
    updateStatus(id: string, status: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string | null;
        status: string;
        amount: number | null;
    }>;
}
