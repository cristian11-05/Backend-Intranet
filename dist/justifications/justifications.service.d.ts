import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
export declare class JustificationsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(data: Prisma.JustificationCreateInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: string;
        type: string;
        files: string[];
        startDate: Date;
        endDate: Date;
        reason: string;
    }>;
    findAll(): Promise<({
        user: {
            id: number;
            documento: string | null;
            email: string;
            password: string;
            nombre: string | null;
            rol: string;
            area_id: string | null;
            estado: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: string;
        type: string;
        files: string[];
        startDate: Date;
        endDate: Date;
        reason: string;
    })[]>;
    findOne(id: number): Promise<({
        user: {
            id: number;
            documento: string | null;
            email: string;
            password: string;
            nombre: string | null;
            rol: string;
            area_id: string | null;
            estado: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: string;
        type: string;
        files: string[];
        startDate: Date;
        endDate: Date;
        reason: string;
    }) | null>;
    update(id: number, data: Prisma.JustificationUpdateInput): Promise<{
        user: {
            id: number;
            documento: string | null;
            email: string;
            password: string;
            nombre: string | null;
            rol: string;
            area_id: string | null;
            estado: string;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: string;
        type: string;
        files: string[];
        startDate: Date;
        endDate: Date;
        reason: string;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        status: string;
        type: string;
        files: string[];
        startDate: Date;
        endDate: Date;
        reason: string;
    }>;
}
