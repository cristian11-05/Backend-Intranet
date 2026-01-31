import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum JustificationStatus {
    PENDIENTE = 'pendiente',
    EN_PROCESO = 'en_proceso',
    APROBADO = 'aprobado',
    RECHAZADO = 'rechazado',
}

export class UpdateJustificationStatusDto {
    @ApiProperty({ enum: JustificationStatus })
    @IsEnum(JustificationStatus)
    @IsNotEmpty()
    estado: string;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.estado === JustificationStatus.RECHAZADO)
    @IsString()
    @IsNotEmpty({ message: 'La razón de rechazo es obligatoria si el estado es rechazado' })
    razon_rechazo?: string;
}
