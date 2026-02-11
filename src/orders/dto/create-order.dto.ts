import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
    @ApiProperty({ example: 1, description: 'ID del usuario que realiza la orden' })
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty({ example: 'Almuerzo Ejecutivo', description: 'Descripción del pedido' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 15.50, description: 'Monto del pedido', required: false })
    @IsNumber()
    @IsOptional()
    amount?: number;
}
