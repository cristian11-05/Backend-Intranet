import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';
export declare class SuggestionsService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(data: Prisma.SuggestionCreateInput): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string;
        status: string;
        area: string;
        type: string;
        title: string;
        files: string[];
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
        description: string;
        status: string;
        area: string;
        type: string;
        title: string;
        files: string[];
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
        description: string;
        status: string;
        area: string;
        type: string;
        title: string;
        files: string[];
    }) | null>;
    update(id: number, data: Prisma.SuggestionUpdateInput): Promise<{
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
        description: string;
        status: string;
        area: string;
        type: string;
        title: string;
        files: string[];
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        description: string;
        status: string;
        area: string;
        type: string;
        title: string;
        files: string[];
    }>;
}
