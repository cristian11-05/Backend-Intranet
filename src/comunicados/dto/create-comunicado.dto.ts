import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateComunicadoDto {
    @ApiProperty({ example: 'Nuevo Beneficio', description: 'Título del comunicado' })
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @ApiProperty({ example: 'A partir de mañana...', description: 'Contenido del comunicado' })
    @IsString()
    @IsNotEmpty()
    contenido: string;

    @ApiProperty({ example: 'https://...', description: 'URL de la imagen o base64', required: false })
    @IsString()
    @IsOptional()
    imagen?: string;

    @ApiProperty({ example: 1, description: 'ID del autor (usuario)', required: false })
    @IsOptional()
    autor_id?: any;

    @ApiProperty({ example: true, description: 'Estado activo del comunicado', default: true })
    @IsOptional()
    activo?: any;
}
