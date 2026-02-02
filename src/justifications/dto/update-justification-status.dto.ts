import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JustificationStatus {
    PENDIENTE = 'pendiente',
    EN_PROCESO = 'en_proceso',
    APROBADA = 'aprobada',
    RECHAZADA = 'rechazada',
    APROBADO = 'aprobado',
    RECHAZADO = 'rechazado',
}

export class UpdateJustificationStatusDto {
    @ApiProperty({ enum: JustificationStatus, example: 'aprobada' })
    @IsEnum(JustificationStatus)
    @IsNotEmpty()
    estado: string;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.estado === JustificationStatus.RECHAZADA || o.estado === JustificationStatus.RECHAZADO)
    @IsString()
    @IsNotEmpty({ message: 'La razón de rechazo es obligatoria si el estado es rechazado' })
    razon_rechazo?: string;
}
