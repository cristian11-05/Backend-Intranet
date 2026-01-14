import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SuggestionType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSuggestionDto {
  @ApiProperty({ enum: SuggestionType, example: SuggestionType.SUGERENCIA })
  @IsNotEmpty()
  @IsEnum(SuggestionType)
  tipo: SuggestionType;

  @ApiProperty({ example: 'Mejora en el comedor' })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({
    example: 'Sería ideal contar con más microondas en el área de descanso.',
  })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({
    example: 'https://cdn.example.com/attachments/photo.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  adjunto_url?: string;
}
