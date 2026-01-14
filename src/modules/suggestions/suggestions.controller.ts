import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('suggestions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('suggestions')
export class SuggestionsController {
    constructor(private readonly suggestionsService: SuggestionsService) { }

    @Post()
    @ApiOperation({ summary: 'Enviar una sugerencia o reclamo' })
    create(@GetUser() user: any, @Body() createDto: CreateSuggestionDto) {
        return this.suggestionsService.create(user.userId, createDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GESTOR)
    @ApiOperation({ summary: 'Ver todas las sugerencias (Admin/Gestor only)' })
    findAll() {
        return this.suggestionsService.findAll();
    }
}
