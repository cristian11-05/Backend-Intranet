import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuggestionDto {
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
    tipo: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    descripcion: string;
}
