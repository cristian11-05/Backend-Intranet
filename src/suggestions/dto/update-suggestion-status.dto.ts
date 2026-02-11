import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 0 = pendiente, 1 = revisada
export class UpdateSuggestionStatusDto {
    @ApiProperty({ enum: [0, 1], example: 1, description: '0=pendiente, 1=revisada' })
    @IsNumber()
    @IsIn([0, 1])
    @IsNotEmpty()
    estado: number;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    comentario?: string;
}
