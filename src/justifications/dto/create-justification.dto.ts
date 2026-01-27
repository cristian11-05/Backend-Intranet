import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum JustificationType {
    INASISTENCIA = 'INASISTENCIA',
    PERMISO = 'PERMISO',
}

export class CreateJustificationDto {
    @ApiProperty({ example: 1, description: 'ID del usuario' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ enum: JustificationType, example: 'INASISTENCIA', description: 'Tipo de justificación' })
    @IsEnum(JustificationType)
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: '2024-01-26', description: 'Fecha de inicio' })
    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @ApiProperty({ example: '2024-01-27', description: 'Fecha de fin' })
    @IsDateString()
    @IsNotEmpty()
    endDate: string;

    @ApiProperty({ example: 'Cita médica en el Seguro', description: 'Motivo de la justificación' })
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({ example: ['https://...'], description: 'URLs de pruebas adjuntas', required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    files?: string[];
}
