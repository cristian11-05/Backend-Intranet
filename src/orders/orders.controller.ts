import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
    async create(@Body() createOrderDto: CreateOrderDto) {
        const { userId, ...data } = createOrderDto;
        return this.ordersService.create(userId, data);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders (paginated)' })
    @ApiResponse({ status: 200, description: 'Return all orders.' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.ordersService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    @ApiResponse({ status: 200, description: 'The order status has been successfully updated.' })
    async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateOrderStatusDto) {
        return this.ordersService.updateStatus(+id, updateStatusDto.status);
    }
}
