import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaDto {
  @ApiProperty({ example: 'Recursos Humanos' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({
    example: 'Departamento encargado de la gestión del personal',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
