import { PrismaService } from '../../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';
export declare class AreasService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createAreaDto: CreateAreaDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
    }>;
    findAll(): Promise<({
        _count: {
            users: number;
        };
    } & {
        id: string;
        nombre: string;
        descripcion: string | null;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
    }>;
    update(id: string, updateAreaDto: CreateAreaDto): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        nombre: string;
        descripcion: string | null;
    }>;
}
