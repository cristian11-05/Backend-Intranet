import { PrismaService } from '../../prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
export declare class SuggestionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createDto: CreateSuggestionDto): Promise<{
        id: string;
        area_id: string | null;
        descripcion: string;
        titulo: string;
        fecha_creacion: Date;
        usuario_id: string;
        tipo: import(".prisma/client").$Enums.SuggestionType;
    }>;
    findAll(): Promise<({
        area: {
            nombre: string;
        };
        usuario: {
            nombre: string;
            rol: import(".prisma/client").$Enums.Role;
        };
        attachments: {
            id: string;
            nombre_archivo: string;
            ruta_archivo: string;
            tipo_archivo: string;
            fecha_carga: Date;
            tamano: number;
            suggestion_id: string;
        }[];
    } & {
        id: string;
        area_id: string | null;
        descripcion: string;
        titulo: string;
        fecha_creacion: Date;
        usuario_id: string;
        tipo: import(".prisma/client").$Enums.SuggestionType;
    })[]>;
}
