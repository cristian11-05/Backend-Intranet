import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { Prisma } from '@prisma/client';

@Controller('justifications')
export class JustificationsController {
    constructor(private readonly justificationsService: JustificationsService) { }

    @Post()
    create(@Body() createJustificationDto: Prisma.JustificationCreateInput) {
        return this.justificationsService.create(createJustificationDto);
    }

    @Get()
    findAll() {
        return this.justificationsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.justificationsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateJustificationDto: Prisma.JustificationUpdateInput) {
        return this.justificationsService.update(+id, updateJustificationDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.justificationsService.remove(+id);
    }
}
