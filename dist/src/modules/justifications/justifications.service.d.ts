import { PrismaService } from '../../prisma/prisma.service';
import { CreateJustificationDto, UpdateJustificationStatusDto } from './dto/create-justification.dto';
export declare class JustificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createJustificationDto: CreateJustificationDto): Promise<{
        id: string;
        area_id: string | null;
        estado: import(".prisma/client").$Enums.JustificationStatus;
        descripcion: string;
        titulo: string;
        fecha_evento: Date;
        hora_inicio: string | null;
        hora_fin: string | null;
        razon_rechazo: string | null;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        usuario_id: string;
        aprobado_por: string | null;
    }>;
    findAll(role: string, userId: string): Promise<({
        attachments: {
            id: string;
            nombre_archivo: string;
            ruta_archivo: string;
            tipo_archivo: string;
            fecha_carga: Date;
            justification_id: string;
        }[];
    } & {
        id: string;
        area_id: string | null;
        estado: import(".prisma/client").$Enums.JustificationStatus;
        descripcion: string;
        titulo: string;
        fecha_evento: Date;
        hora_inicio: string | null;
        hora_fin: string | null;
        razon_rechazo: string | null;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        usuario_id: string;
        aprobado_por: string | null;
    })[]>;
    updateStatus(id: string, adminId: string, statusDto: UpdateJustificationStatusDto): Promise<{
        id: string;
        area_id: string | null;
        estado: import(".prisma/client").$Enums.JustificationStatus;
        descripcion: string;
        titulo: string;
        fecha_evento: Date;
        hora_inicio: string | null;
        hora_fin: string | null;
        razon_rechazo: string | null;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        usuario_id: string;
        aprobado_por: string | null;
    }>;
}
