import { Controller, Get, Post, Body, Patch, Delete, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get('export')
    async export(@Res() res: Response) {
        const csv = await this.usersService.exportUsers();
        res.header('Content-Type', 'text/csv');
        res.attachment('usuarios.csv');
        return res.send(csv);
    }

    @Post()
    async create(@Body() createUserDto: Prisma.UserCreateInput) {
        // Si no viene contraseña, le asignamos su documento como clave por defecto
        if (!createUserDto.password && createUserDto.documento) {
            createUserDto.password = createUserDto.documento;
        }

        // Si no viene email, generamos uno por defecto usando el documento
        if (!createUserDto.email && createUserDto.documento) {
            createUserDto.email = `${createUserDto.documento}@sistema.com`;
        }
        return this.usersService.create(createUserDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
