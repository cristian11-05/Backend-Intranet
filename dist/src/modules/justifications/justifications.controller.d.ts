import { JustificationsService } from './justifications.service';
import { CreateJustificationDto, UpdateJustificationStatusDto } from './dto/create-justification.dto';
export declare class JustificationsController {
    private readonly justificationsService;
    constructor(justificationsService: JustificationsService);
    create(user: any, createDto: CreateJustificationDto): Promise<{
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
    findAll(user: any): Promise<({
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
    updateStatus(id: string, user: any, statusDto: UpdateJustificationStatusDto): Promise<{
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
