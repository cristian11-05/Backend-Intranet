import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findOne(where: Prisma.UserWhereInput): Promise<User | null>;
    findAll(): Promise<User[]>;
    exportUsers(): Promise<string>;
    create(data: Prisma.UserCreateInput): Promise<User>;
    update(id: number, data: Prisma.UserUpdateInput): Promise<User>;
    remove(id: number): Promise<User>;
}
