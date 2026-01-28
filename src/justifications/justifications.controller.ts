import { Controller, Get, Post, Body, Patch, Param, Query, Headers, UnauthorizedException } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { CreateJustificationDto } from './dto/create-justification.dto';
import { ApiTags, ApiOperation, ApiResponse, OmitType } from '@nestjs/swagger';
import { PaginationDto } from '../common/dto/pagination.dto';
import { JwtService } from '@nestjs/jwt';

class CreateMobileJustificationDto extends OmitType(CreateJustificationDto, ['usuario_id'] as const) { }

@ApiTags('Justifications')
@Controller('justifications')
export class JustificationsController {
    constructor(
        private readonly justificationsService: JustificationsService,
        private readonly jwtService: JwtService,
    ) { }

    @Post()
    @ApiOperation({ summary: 'Create a new justification' })
    @ApiResponse({ status: 201, description: 'Created' })
    create(@Body() createJustificationDto: CreateJustificationDto) {
        return this.justificationsService.create(createJustificationDto);
    }

    // Endpoint Móvil para Crear
    @Post('mobile')
    @ApiOperation({ summary: 'Create a new justification (Mobile - Auth Token required)' })
    async createMobile(@Headers('authorization') auth: string, @Body() body: any) {
        if (!auth) throw new UnauthorizedException('Token required');
        const token = auth.replace('Bearer ', '');
        try {
            const payload = this.jwtService.decode(token);
            if (!payload || !payload.sub) throw new UnauthorizedException('Invalid token');

            // Adaptar claves Inglés -> Español para compatibilidad
            const title = body.titulo || body.title;
            const desc = body.descripcion || body.description;
            const areaId = body.area_id || body.areaId;
            // Fecha evento: la app podría mandar eventDate o date
            const fecha = body.fecha_evento || body.eventDate || body.date;

            const fullDto: CreateJustificationDto = {
                titulo: title,
                descripcion: desc,
                fecha_evento: fecha,
                usuario_id: payload.sub,
                area_id: areaId,
                hora_inicio: body.hora_inicio || body.startTime,
                hora_fin: body.hora_fin || body.endTime,
                estado: 'Pendiente' // Default para Web Dashboard
            };
            return await this.justificationsService.create(fullDto);
        } catch (e) {
            console.error('Justification Mobile Error:', e);
            throw new UnauthorizedException('Error procesando solicitud: ' + e.message);
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all justifications' })
    findAll(@Query() paginationDto: PaginationDto) {
        return this.justificationsService.findAll(paginationDto.page, paginationDto.limit);
    }

    // Endpoint Móvil para Listar
    @Get('mobile')
    @ApiOperation({ summary: 'Get all justifications (Mobile - Simple Array)' })
    async findAllMobile(@Query() paginationDto: PaginationDto) {
        const result = await this.justificationsService.findAll(paginationDto.page, 100);
        return result.data;
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update justification status' })
    updateStatus(
        @Param('id') id: string,
        @Body('estado') estado: string,
        @Body('aprobado_por') aprobado_por?: number,
    ) {
        return this.justificationsService.updateStatus(+id, estado, aprobado_por);
    }
}
