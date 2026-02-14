import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 0 = pendiente, 1 = revisada
export class UpdateSuggestionStatusDto {
    @ApiProperty({ example: 1, description: '0=pendiente, 1=revisada o el texto "revisada"' })
    @IsNotEmpty()
    estado: number | string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    comentario?: string;
}
