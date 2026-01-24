import type { Response } from 'express';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
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
    }[]>;
    export(res: Response): Promise<Response<any, Record<string, any>>>;
    create(createUserDto: Prisma.UserCreateInput): Promise<{
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
    }>;
    update(id: string, updateUserDto: Prisma.UserUpdateInput): Promise<{
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
    }>;
    remove(id: string): Promise<{
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
    }>;
}
