import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// 0 = pendiente, 1 = aprobado, 2 = rechazado
export class UpdateJustificationStatusDto {
    @ApiProperty({ enum: [0, 1, 2], example: 1, description: '0=pendiente, 1=aprobado, 2=rechazado' })
    @IsNumber()
    @IsIn([0, 1, 2])
    @IsNotEmpty()
    estado: number;

    @ApiProperty({ required: false })
    @ValidateIf(o => o.estado === 2)
    @IsString()
    @IsNotEmpty({ message: 'La razón de rechazo es obligatoria si el estado es rechazado' })
    razon_rechazo?: string;
}
