import { ComunicadosService } from './comunicados.service';
export declare class ComunicadosController {
    private readonly comunicadosService;
    constructor(comunicadosService: ComunicadosService);
    create(body: any, req: any): Promise<{
        status: boolean;
        data: {
            id: number;
            titulo: string;
            contenido: string;
            imagen_url: string | null;
            fecha_publicacion: Date;
            activo: boolean;
            created_at: Date;
            updated_at: Date;
            autor_id: number;
        };
        message: string;
    }>;
    findAll(): Promise<{
        status: boolean;
        data: ({
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
        })[];
    }>;
    findOne(id: string): Promise<{
        status: boolean;
        data: ({
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
        }) | null;
    }>;
    update(id: string, body: any): Promise<{
        status: boolean;
        data: {
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
        };
    }>;
    remove(id: string): Promise<{
        status: boolean;
        message: string;
    }>;
}
