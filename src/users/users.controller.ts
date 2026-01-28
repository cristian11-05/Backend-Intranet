import { Controller, Get, Post, Body, Patch, Delete, Param, Res, Query } from '@nestjs/common';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users (paginated)' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    async findAll(@Query() paginationDto: PaginationDto) {
        return this.usersService.findAll(paginationDto.page, paginationDto.limit);
    }

    @Get('export')
    @ApiOperation({ summary: 'Export users to CSV' })
    @ApiResponse({ status: 200, description: 'CSV file with users data.' })
    async export(@Res() res: Response) {
        const csv = await this.usersService.exportUsers();
        res.header('Content-Type', 'text/csv');
        res.attachment('usuarios.csv');
        return res.send(csv);
    }


    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createUserDto: CreateUserDto) {
        console.log('Creating user with data:', createUserDto);
        const { documento, contrasena, area_id, estado, ...userData } = createUserDto;

        let finalContrasena = contrasena;
        if (!finalContrasena && documento) {
            finalContrasena = documento;
        }

        let finalEmail = userData.email;
        if (!finalEmail && documento) {
            finalEmail = `${documento}@aquanqa.com`; // Changed to aquanqa.com
        }

        if (!finalContrasena) {
            throw new Error('La contraseña es requerida');
        }

        if (!finalEmail) {
            throw new Error('El email es requerido');
        }

        // Map state string to boolean
        const finalEstado = estado === 'Activo' ? true : (estado === 'Inactivo' ? false : true);

        // Map area_id to number if present
        const finalAreaId = area_id ? parseInt(area_id.toString()) : undefined;

        const prismaData = {
            ...userData,
            email: finalEmail,
            contrasena: finalContrasena,
            estado: finalEstado,
            area_id: finalAreaId,
            documento: documento, // Ensure documento is included
        };

        console.log('Final Prisma payload for create:', JSON.stringify(prismaData));
        try {
            return await this.usersService.create(prismaData as any);
        } catch (error) {
            console.error('Error in UsersController.create:', error.message);
            throw error;
        }
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        console.log(`[Update] Received request for ID ${id}:`, JSON.stringify(updateUserDto));

        try {
            const { documento, area_id, estado, nombre, email, rol, contrasena } = updateUserDto as any;

            const mappedData: any = {};
            if (nombre !== undefined) mappedData.nombre = nombre;
            if (email !== undefined) mappedData.email = email;
            if (rol !== undefined) mappedData.rol = rol;
            if (contrasena !== undefined) mappedData.contrasena = contrasena;
            if (documento !== undefined) mappedData.documento = documento;

            if (estado !== undefined) {
                mappedData.estado = (estado === 'Activo');
            }

            if (area_id !== undefined) {
                mappedData.area_id = area_id ? parseInt(area_id.toString()) : null;
            }

            console.log(`[Update] Final mapping for SQL of ID ${id}:`, JSON.stringify(mappedData));

            // Use raw SQL to bypass Prisma Client field validation (since schema.prisma is out of sync)
            const sql = `
                UPDATE users 
                SET nombre = $1, email = $2, rol = $3, estado = $4, documento = $5, area_id = $6
                WHERE id = $7
            `;
            await (this.usersService as any).prisma.$executeRawUnsafe(
                sql,
                mappedData.nombre,
                mappedData.email,
                mappedData.rol,
                mappedData.estado,
                mappedData.documento,
                mappedData.area_id,
                +id
            );

            console.log(`[Update] SUCCESS (SQL) for ID ${id}`);
            return { id: +id, ...mappedData };
        } catch (error) {
            console.error(`[Update] ERROR for ID ${id}:`, error.message);
            throw error;
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
    async remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
