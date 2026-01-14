import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import {
  CreateJustificationDto,
  UpdateJustificationStatusDto,
} from './dto/create-justification.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('justifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('justifications')
export class JustificationsController {
  constructor(private readonly justificationsService: JustificationsService) { }

  @Post()
  @ApiOperation({ summary: 'Trabajador sube una justificación' })
  create(@GetUser() user: any, @Body() createDto: CreateJustificationDto) {
    return this.justificationsService.create(user.userId, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Ver lista de justificantes' })
  findAll(@GetUser() user: any) {
    return this.justificationsService.findAll(user.rol, user.userId);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.GESTOR)
  @ApiOperation({ summary: 'Admin aprueba o rechaza justificante' })
  updateStatus(
    @Param('id') id: string,
    @GetUser() user: any,
    @Body() statusDto: UpdateJustificationStatusDto,
  ) {
    return this.justificationsService.updateStatus(id, user.userId, statusDto);
  }
}
