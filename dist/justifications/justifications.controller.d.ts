import { JustificationsService } from './justifications.service';
import { Prisma } from '@prisma/client';
export declare class JustificationsController {
    private readonly justificationsService;
    constructor(justificationsService: JustificationsService);
    create(createJustificationDto: Prisma.JustificationCreateInput): Promise<{
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
    findOne(id: string): Promise<({
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
    update(id: string, updateJustificationDto: Prisma.JustificationUpdateInput): Promise<{
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
    remove(id: string): Promise<{
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
