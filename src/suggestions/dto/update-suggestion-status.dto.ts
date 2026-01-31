import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum SuggestionStatus {
    PENDIENTE = 'pendiente',
    REVISADA = 'revisada',
}

export class UpdateSuggestionStatusDto {
    @ApiProperty({ enum: SuggestionStatus, example: 'revisada' })
    @IsEnum(SuggestionStatus)
    @IsNotEmpty()
    estado: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    comentario?: string;
}
