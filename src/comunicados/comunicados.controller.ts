import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, Put } from '@nestjs/common';
import { ComunicadosService } from './comunicados.service';
import { Prisma } from '@prisma/client';

@Controller('comunicados')
export class ComunicadosController {
    constructor(private readonly comunicadosService: ComunicadosService) { }

    @Post()
    @Post()
    async create(@Body() body: any, @Req() req: any) {
        // Mock user for now if Auth not yet fully integrated in request context
        const autorId = body.autor_id || 1;

        const data = await this.comunicadosService.create({ ...body, autor_id: autorId });
        return { status: true, data, message: 'Comunicado creado exitosamente' };
    }

    @Get()
    async findAll() {
        const data = await this.comunicadosService.findAll();
        return { status: true, data };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const data = await this.comunicadosService.findOne(+id);
        return { status: true, data };
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        const data = await this.comunicadosService.update(+id, body);
        return { status: true, data };
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.comunicadosService.remove(+id);
        return { status: true, message: 'Comunicado eliminado exitosamente' };
    }
}
