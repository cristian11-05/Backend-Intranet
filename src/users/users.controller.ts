import { Controller, Get, Post, Body, Patch, Delete, Param, Res, Query, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Import users from Excel' })
    @ApiResponse({ status: 200, description: 'Users imported successfully.' })
    async import(@UploadedFile() file: Express.Multer.File | undefined) {
        if (!file) {
            throw new Error('Archivo no encontrado');
        }
        return this.usersService.importExcel(file.buffer);
    }

    @Post('bulk-delete')
    @ApiOperation({ summary: 'Delete multiple users by document' })
    @ApiResponse({ status: 200, description: 'Users deleted successfully.' })
    async bulkRemove(@Body() body: { documents: string[], action?: 'inactivate' | 'delete' }) {
        const { documents, action = 'inactivate' } = body;
        if (!documents || !Array.isArray(documents)) {
            throw new Error('Lista de documentos no válida');
        }
        return this.usersService.bulkRemove(documents, action);
    }


    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createUserDto: CreateUserDto) {
        console.log('Creating user with data:', createUserDto);
        const { documento, dni, contrasena, area_id, estado, status, rol, tipo_contrato, ...userData } = createUserDto as any;

        const finalDocumento = (documento && documento !== '') ? documento : dni;

        let finalContrasena = (contrasena && contrasena !== '') ? contrasena : createUserDto.password;
        if ((!finalContrasena || finalContrasena === '') && finalDocumento) {
            finalContrasena = finalDocumento;
        }

        let finalEmail = userData.email;
        if ((!finalEmail || finalEmail === '') && finalDocumento) {
            finalEmail = `${finalDocumento}@aquanqa.com`;
        }

        if (!finalContrasena || finalContrasena === '') {
            throw new Error('La contraseña es requerida');
        }

        if (!finalEmail || finalEmail === '') {
            throw new Error('El email es requerido');
        }

        // Map state string to boolean
        const estadoRaw = estado !== undefined ? estado : status;
        const finalEstado = (estadoRaw === 'Activo' || estadoRaw === true || estadoRaw === 'true');

        // Map role/contract type
        const finalRol = rol || tipo_contrato || 'empleado';

        // Map area_id to number if present
        const finalAreaIdRaw = area_id !== undefined ? area_id : createUserDto.areaId;
        let finalAreaId: number | undefined = undefined;
        if (finalAreaIdRaw !== undefined && finalAreaIdRaw !== null && finalAreaIdRaw !== '') {
            const parsed = parseInt(finalAreaIdRaw.toString());
            if (!isNaN(parsed)) {
                finalAreaId = parsed;
            }
        }

        const prismaData = {
            ...userData,
            email: finalEmail,
            contrasena: finalContrasena,
            estado: finalEstado,
            rol: finalRol,
            area_id: finalAreaId,
            documento: finalDocumento,
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
            const { documento, dni, area_id, areaId, estado, status, nombre, email, rol, tipo_contrato, contrasena, password } = updateUserDto as any;

            const finalDocumento = documento || dni;
            const finalRol = rol || tipo_contrato;
            const finalEstadoRaw = estado !== undefined ? estado : status;
            const finalAreaIdRaw = area_id !== undefined ? areaId : area_id; // Added fallback
            const finalContrasena = contrasena || password;

            const mappedData: any = {};
            if (nombre !== undefined) mappedData.nombre = nombre;
            if (email !== undefined) mappedData.email = email;
            if (finalRol !== undefined) mappedData.rol = finalRol;
            if (finalContrasena !== undefined) mappedData.contrasena = finalContrasena;
            if (finalDocumento !== undefined) mappedData.documento = finalDocumento;

            if (finalEstadoRaw !== undefined) {
                mappedData.estado = (finalEstadoRaw === 'Activo' || finalEstadoRaw === true || finalEstadoRaw === 'true');
            }

            if (finalAreaIdRaw !== undefined || area_id !== undefined) {
                const aId = finalAreaIdRaw !== undefined ? finalAreaIdRaw : area_id;
                mappedData.area_id = parseInt(aId.toString());
            }

            console.log(`[Update] Final mapping for ID ${id}:`, JSON.stringify(mappedData));

            // Try standard Prisma first (best case)
            try {
                const updatedUser = await this.usersService.update(+id, mappedData);
                console.log(`[Update] SUCCESS (Prisma) for ID ${id}`);
                return updatedUser;
            } catch (prismaError) {
                console.warn(`[Update] Prisma update failed for ID ${id}, falling back to dynamic SQL:`, prismaError.message);

                const fields: string[] = [];
                const values: any[] = [];
                let placeholdersCount = 1;

                if (mappedData.nombre !== undefined) { fields.push(`nombre = $${placeholdersCount++}`); values.push(mappedData.nombre); }
                if (mappedData.email !== undefined) { fields.push(`email = $${placeholdersCount++}`); values.push(mappedData.email); }
                if (mappedData.rol !== undefined) { fields.push(`rol = $${placeholdersCount++}`); values.push(mappedData.rol); }
                if (mappedData.estado !== undefined) { fields.push(`estado = $${placeholdersCount++}`); values.push(mappedData.estado); }
                if (mappedData.documento !== undefined) { fields.push(`documento = $${placeholdersCount++}`); values.push(mappedData.documento); }
                if (mappedData.area_id !== undefined) { fields.push(`area_id = $${placeholdersCount++}`); values.push(mappedData.area_id); }

                if (fields.length === 0) {
                    return this.usersService.findOne({ id: +id });
                }

                values.push(+id);
                const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${placeholdersCount}`;
                await (this.usersService as any).prisma.$executeRawUnsafe(sql, ...values);

                console.log(`[Update] SUCCESS (Dynamic SQL) for ID ${id}`);
                return this.usersService.findOne({ id: +id });
            }
        } catch (error) {
            console.error(`[Update] CRITICAL ERROR for ID ${id}:`, error.message);
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
