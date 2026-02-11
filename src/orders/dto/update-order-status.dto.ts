import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

// 0 = pendiente, 1 = aprobado, 2 = rechazado
export class UpdateOrderStatusDto {
    @ApiProperty({ enum: [0, 1, 2], example: 1, description: '0=pendiente, 1=aprobado, 2=rechazado' })
    @IsNumber()
    @IsIn([0, 1, 2])
    @IsNotEmpty()
    status: number;
}
