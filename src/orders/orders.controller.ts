import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    // Los operarios (Móvil) crean órdenes
    @Post()
    async create(@Body() body: { userId: number, description: string, amount?: number }) {
        const { userId, ...data } = body;
        return this.ordersService.create(userId, data);
    }

    // El administrador (Web) ve todas las órdenes
    @Get()
    async findAll() {
        return this.ordersService.findAll();
    }

    // El administrador (Web) cambia el estado
    @Patch(':id/status')
    async updateStatus(@Param('id') id: string, @Body('status') status: string) {
        return this.ordersService.updateStatus(+id, status);
    }
}
