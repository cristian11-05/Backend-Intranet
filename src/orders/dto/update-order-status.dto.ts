import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
    PENDIENTE = 'PENDIENTE',
    COMPLETADO = 'COMPLETADO',
    CANCELADO = 'CANCELADO',
}

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus, example: 'COMPLETADO', description: 'Nuevo estado de la orden' })
    @IsEnum(OrderStatus)
    @IsNotEmpty()
    status: string;
}
