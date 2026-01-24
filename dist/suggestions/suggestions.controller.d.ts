import { SuggestionsService } from './suggestions.service';
import { Prisma } from '@prisma/client';
export declare class SuggestionsController {
    private readonly suggestionsService;
    constructor(suggestionsService: SuggestionsService);
    create(createSuggestionDto: Prisma.SuggestionCreateInput): Promise<{
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
        description: string;
        status: string;
        area: string;
        type: string;
        title: string;
        files: string[];
    }) | null>;
    update(id: string, updateSuggestionDto: Prisma.SuggestionUpdateInput): Promise<{
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
    remove(id: string): Promise<{
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
