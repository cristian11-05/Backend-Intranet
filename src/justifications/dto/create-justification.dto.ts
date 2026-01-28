import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJustificationDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    usuario_id: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    area_id?: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @ApiProperty()
    @IsDateString()
    @IsNotEmpty()
    fecha_evento: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    hora_inicio?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    hora_fin?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    estado?: string;
}
