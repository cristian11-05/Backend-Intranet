import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Post()
    async create(@Body() createUserDto: Prisma.UserCreateInput) {
        // Si no viene contraseña, le asignamos su documento como clave por defecto
        if (!createUserDto.password && createUserDto.documento) {
            createUserDto.password = createUserDto.documento;
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
