export declare class CreateJustificationDto {
    titulo: string;
    descripcion: string;
    fecha_evento: string;
    hora_inicio?: string;
    hora_fin?: string;
    adjunto_url?: string;
}
export declare class UpdateJustificationStatusDto {
    estado: 'APROBADO' | 'RECHAZADO';
    razon_rechazo?: string;
}
