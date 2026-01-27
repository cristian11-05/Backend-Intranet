import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum SuggestionType {
    RECLAMO = 'RECLAMO',
    SUGERENCIA = 'SUGERENCIA',
}

export class CreateSuggestionDto {
    @ApiProperty({ example: 1, description: 'ID del usuario' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 'Recursos Humanos', description: 'Área a la que va dirigida' })
    @IsString()
    @IsNotEmpty()
    area: string;

    @ApiProperty({ enum: SuggestionType, example: 'SUGERENCIA', description: 'Tipo de mensaje' })
    @IsEnum(SuggestionType)
    @IsNotEmpty()
    type: string;

    @ApiProperty({ example: 'Mejorar el menú', description: 'Título de la sugerencia' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Sería bueno incluir más frutas...', description: 'Descripción detallada' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: ['https://...'], description: 'URLs de archivos adjuntos', required: false })
    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    files?: string[];
}
