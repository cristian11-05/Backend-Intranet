import { Controller, Get, Post, Body, Patch, Delete, Param, Res, Query, UseInterceptors, UploadedFile, ConflictException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { sanitizeEmpresa } from '../common/utils/string.utils';


@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all users (paginated)' })
    @ApiResponse({ status: 200, description: 'Return all users.' })
    async findAll(@Query() paginationDto: PaginationDto) {
        const result = await this.usersService.findAll(paginationDto.page, paginationDto.limit);
        return {
            status: true,
            ...result
        };
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
        const result = await this.usersService.importExcel(file.buffer);
        return {
            status: true,
            message: 'Importación finalizada',
            data: result
        };
    }


    @Post('bulk-delete')
    @ApiOperation({ summary: 'Delete multiple users by document' })
    @ApiResponse({ status: 200, description: 'Users deleted successfully.' })
    async bulkRemove(@Body() body: { documents: string[], action?: 'inactivate' | 'delete' }) {
        const { documents, action = 'inactivate' } = body;
        if (!documents || !Array.isArray(documents)) {
            throw new Error('Lista de documentos no válida');
        }
        const result = await this.usersService.bulkRemove(documents, action);
        return {
            status: true,
            message: action === 'delete' ? 'Usuarios eliminados correctamente' : 'Usuarios inactivados correctamente',
            data: result
        };
    }



    @Post()
    @ApiOperation({ summary: 'Create a new user' })
    @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
    @ApiResponse({ status: 400, description: 'Bad Request.' })
    async create(@Body() createUserDto: CreateUserDto) {
        const { documento, contrasena, area_id, empresa, nombre, email, rol, dni, password } = createUserDto;

        const finalDocumento = documento || dni;
        if (!finalDocumento) {
            throw new Error('El documento es requerido');
        }

        let finalContrasena = contrasena || password || finalDocumento;
        let finalEmail = email || `${finalDocumento}@aquanqa.com`;

        const prismaData = {
            nombre,
            email: finalEmail,
            contrasena: finalContrasena,
            estado: true,
            rol: rol || 'OBRERO',
            area_id: area_id,
            documento: finalDocumento,
            empresa: empresa,
        };



        try {
            const user = await this.usersService.create(prismaData as any);
            return {
                status: true,
                message: 'Colaborador registrado correctamente',
                data: user
            };
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('El usuario con este documento/email ya existe');
            }
            throw error;
        }
    }


    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        try {
            const { documento, dni, area_id, areaId, estado, status, nombre, email, rol, tipo_contrato, contrasena, password, empresa } = updateUserDto as any;

            const finalDocumento = documento || dni;
            const finalRol = rol || tipo_contrato;
            const finalEstadoRaw = estado !== undefined ? estado : status;
            const finalAreaId = area_id !== undefined ? area_id : areaId;
            const finalContrasena = contrasena || password;

            const mappedData: any = {};
            if (nombre !== undefined) mappedData.nombre = nombre;
            if (email !== undefined) mappedData.email = email;
            if (finalRol !== undefined) mappedData.rol = finalRol;
            if (finalContrasena !== undefined) mappedData.contrasena = finalContrasena;
            if (finalDocumento !== undefined) mappedData.documento = finalDocumento;
            if (empresa !== undefined) mappedData.empresa = empresa;

            if (finalEstadoRaw !== undefined) {


                mappedData.estado = (finalEstadoRaw === 'Activo' || finalEstadoRaw === true || finalEstadoRaw === 'true');
            }

            if (finalAreaId !== undefined) {
                mappedData.area_id = parseInt(finalAreaId.toString());
            }

            try {
                const updatedUser = await this.usersService.update(+id, mappedData);
                return {
                    status: true,
                    message: 'Colaborador actualizado correctamente',
                    data: updatedUser
                };
            } catch (prismaError: any) {
                if (prismaError.code === 'P2002') {
                    throw new ConflictException('El usuario con este documento/email ya existe');
                }

                // Falling back to raw SQL if Prisma fails for some reason (as previously implemented)
                const fields: string[] = [];
                const values: any[] = [];
                let placeholdersCount = 1;

                for (const key in mappedData) {
                    fields.push(`${key} = $${placeholdersCount++}`);
                    values.push(mappedData[key]);
                }

                if (fields.length === 0) {
                    const user = await this.usersService.findOne({ id: +id });
                    return { status: true, message: 'No se realizaron cambios', data: user };
                }

                values.push(+id);
                const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = $${placeholdersCount}`;
                await (this.usersService as any).prisma.$executeRawUnsafe(sql, ...values);

                const user = await this.usersService.findOne({ id: +id });
                return {
                    status: true,
                    message: 'Colaborador actualizado correctamente',
                    data: user
                };
            }
        } catch (error) {
            throw error;
        }
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
    async remove(@Param('id') id: string) {
        await this.usersService.remove(+id);
        return {
            status: true,
            message: 'Colaborador eliminado correctamente'
        };
    }

}
