import { Controller, Get, Post, Body, Query, Headers, UnauthorizedException, Patch, Param, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionStatusDto } from './dto/update-suggestion-status.dto';
import { ApiTags, ApiOperation, ApiResponse, OmitType, ApiConsumes } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtService } from '@nestjs/jwt';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { imageFileFilter } from '../common/utils/file-upload.utils';
import { StorageService } from '../common/services/storage.service';

class CreateMobileSuggestionDto extends OmitType(CreateSuggestionDto, ['usuario_id'] as const) { }

@ApiTags('Suggestions')
@Controller('suggestions')
export class SuggestionsController {
    constructor(
        private readonly suggestionsService: SuggestionsService,
        private readonly jwtService: JwtService,
        private readonly storageService: StorageService,
    ) { }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update suggestion status (only Pendiente -> Revisada)' })
    async updateStatus(
        @Param('id') id: string,
        @Body() updateDto: UpdateSuggestionStatusDto,
        @Headers('authorization') auth: string
    ) {
        let adminId = 1; // Default fallback

        if (auth) {
            try {
                const token = auth.replace('Bearer ', '');
                const payload = this.jwtService.decode(token);
                if (payload && payload.sub) {
                    adminId = payload.sub;
                }
            } catch (e) {
                console.error('Error decoding token for audit:', e);
            }
        }

        let finalEstado = updateDto.estado;
        if (typeof finalEstado === 'string' && finalEstado.toLowerCase() === 'revisada') {
            finalEstado = 1;
        }

        return this.suggestionsService.updateStatus(+id, +finalEstado, adminId, updateDto.comentario);
    }

    @Post()
    @ApiOperation({ summary: 'Create a new suggestion' })
    @ApiResponse({ status: 201, description: 'Created' })
    create(@Body() createSuggestionDto: CreateSuggestionDto) {
        return this.suggestionsService.create(createSuggestionDto);
    }

    // Endpoint Móvil para Crear con Multi-imágenes
    @Post('mobile')
    @UseInterceptors(FilesInterceptor('files', 5, {
        storage: memoryStorage(),
        fileFilter: imageFileFilter,
        limits: { fileSize: 10 * 1024 * 1024 } // 10MB per image
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create a new suggestion (Mobile - Auth Token required)' })
    async createMobile(
        @Headers('authorization') auth: string,
        @Body() body: any,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        if (!auth) throw new UnauthorizedException('Token required');
        const token = auth.replace('Bearer ', '');
        try {
            const payload = this.jwtService.decode(token);
            if (!payload || !payload.sub) throw new UnauthorizedException('Invalid token');

            // Adaptar claves Inglés -> Español para compatibilidad
            const type = body.tipo || body.type;
            const title = body.titulo || body.title;
            const desc = body.descripcion || body.description;
            const areaId = body.area_id || body.areaId;

            if (!type || !title || !desc) {
                throw new UnauthorizedException('Faltan campos (tipo/type, titulo/title, descripcion/description)');
            }

            // Normalización para Web Dashboard
            let finalType = type;
            if (type === 'SUGERENCIA' || type === 'Sugerencia') finalType = 'Te escuchamos';
            if (type === 'REPORTE' || type === 'Reporte') finalType = 'Reporte de situación';
            if (type === 'Queja') finalType = 'Te escuchamos';

            const fullDto: CreateSuggestionDto = {
                tipo: finalType,
                titulo: title,
                descripcion: desc,
                usuario_id: payload.sub,
                area_id: areaId ? +areaId : undefined
            };

            // Upload files to Supabase and get URLs
            const attachments: { ruta_archivo: string; tipo_archivo: string }[] = [];
            if (files && files.length > 0) {
                for (const file of files) {
                    const url = await this.storageService.uploadFile(file, 'suggestions');
                    attachments.push({
                        ruta_archivo: url,
                        tipo_archivo: file.mimetype
                    });
                }
            }

            return await this.suggestionsService.create(fullDto, attachments);
        } catch (e) {
            console.error('Mobile Create Error:', e);
            throw new UnauthorizedException('Error procesando solicitud: ' + e.message);
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all suggestions' })
    findAll(@Query() paginationDto: PaginationDto) {
        return this.suggestionsService.findAll(paginationDto.page, paginationDto.limit);
    }

    // Endpoint Móvil para Listar
    @Get('mobile')
    @ApiOperation({ summary: 'Get all suggestions (Mobile - Simple Array)' })
    async findAllMobile(@Query() paginationDto: PaginationDto) {
        const result = await this.suggestionsService.findAll(paginationDto.page, 100); // Traer más items para móvil
        return result.data; // Retorna directo el array
    }
}
