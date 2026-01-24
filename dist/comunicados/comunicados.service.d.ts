import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
export declare class ComunicadosService {
    private prisma;
    private notificationsService;
    constructor(prisma: PrismaService, notificationsService: NotificationsService);
    create(data: any): Promise<{
        id: number;
        titulo: string;
        contenido: string;
        imagen_url: string | null;
        fecha_publicacion: Date;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        autor_id: number;
    }>;
    findAll(): Promise<({
        autor: {
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
        titulo: string;
        contenido: string;
        imagen_url: string | null;
        fecha_publicacion: Date;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        autor_id: number;
    })[]>;
    findOne(id: number): Promise<({
        autor: {
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
        titulo: string;
        contenido: string;
        imagen_url: string | null;
        fecha_publicacion: Date;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        autor_id: number;
    }) | null>;
    update(id: number, data: any): Promise<{
        autor: {
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
        titulo: string;
        contenido: string;
        imagen_url: string | null;
        fecha_publicacion: Date;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        autor_id: number;
    }>;
    remove(id: number): Promise<{
        id: number;
        titulo: string;
        contenido: string;
        imagen_url: string | null;
        fecha_publicacion: Date;
        activo: boolean;
        created_at: Date;
        updated_at: Date;
        autor_id: number;
    }>;
    private saveBase64Image;
}
