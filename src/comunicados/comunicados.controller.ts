import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UnauthorizedException, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ComunicadosService } from './comunicados.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { CreateComunicadoDto } from './dto/create-comunicado.dto';
import { UpdateComunicadoDto } from './dto/update-comunicado.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFileFilter, editFileName } from '../common/utils/file-upload.utils';

@ApiTags('Comunicados')
@Controller('comunicados')
export class ComunicadosController {
    constructor(private readonly comunicadosService: ComunicadosService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: editFileName
        }),
        fileFilter: imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create a new announcement with an optional image file' })
    @ApiResponse({ status: 201, description: 'The announcement has been successfully created.' })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createComunicadoDto: CreateComunicadoDto,
        @Req() req: any
    ) {
        const autorId = createComunicadoDto.autor_id || 1;
        const data = { ...createComunicadoDto, autor_id: autorId };

        if (file) {
            data.imagen = `/uploads/${file.filename}`;
        }

        const result = await this.comunicadosService.create(data);
        return { status: true, data: result, message: 'Comunicado creado exitosamente' };
    }

    @Get()
    @ApiOperation({ summary: 'Get all active announcements' })
    @ApiResponse({ status: 200, description: 'Return all announcements.' })
    async findAll() {
        const data = await this.comunicadosService.findAll();
        return { status: true, data };
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an announcement by id' })
    @ApiResponse({ status: 200, description: 'Return the announcement.' })
    async findOne(@Param('id') id: string) {
        const data = await this.comunicadosService.findOne(+id);
        return { status: true, data };
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an announcement' })
    @ApiResponse({ status: 200, description: 'The announcement has been successfully updated.' })
    async update(@Param('id') id: string, @Body() updateComunicadoDto: UpdateComunicadoDto) {
        const data = await this.comunicadosService.update(+id, updateComunicadoDto);
        return { status: true, data };
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete (deactivate) an announcement' })
    @ApiResponse({ status: 200, description: 'The announcement has been successfully deleted.' })
    async remove(@Param('id') id: string) {
        await this.comunicadosService.remove(+id);
        return { status: true, message: 'Comunicado eliminado exitosamente' };
    }
}
