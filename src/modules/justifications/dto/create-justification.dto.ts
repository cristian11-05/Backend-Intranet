import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJustificationDto {
  @ApiProperty({ example: 'Cita Médica' })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'Asistencia a cita médica en ESSALUD' })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({ example: '2024-03-20' })
  @IsNotEmpty()
  @IsDateString()
  fecha_evento: string;

  @ApiProperty({ example: '08:00', required: false })
  @IsOptional()
  @IsString()
  hora_inicio?: string;

  @ApiProperty({ example: '10:00', required: false })
  @IsOptional()
  @IsString()
  hora_fin?: string;

  @ApiProperty({
    example: 'https://cdn.example.com/justificantes/doc123.pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  adjunto_url?: string;
}

export class UpdateJustificationStatusDto {
  @ApiProperty({ example: 'APROBADO' })
  @IsNotEmpty()
  @IsString()
  estado: 'APROBADO' | 'RECHAZADO';

  @ApiProperty({ example: 'Falta adjunto legible', required: false })
  @IsOptional()
  @IsString()
  razon_rechazo?: string;
}
