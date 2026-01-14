import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Patch,
    UseGuards,
    Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo trabajador (Admin only)' })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.GESTOR)
    @ApiOperation({ summary: 'Listar trabajadores con filtros (Admin/Gestor)' })
    @ApiQuery({ name: 'rol', required: false })
    @ApiQuery({ name: 'areaId', required: false })
    findAll(@Query('rol') rol?: string, @Query('areaId') areaId?: string) {
        return this.usersService.findAll(rol, areaId);
    }

    @Get('profile')
    @ApiOperation({ summary: 'Ver perfil del usuario actual' })
    getProfile(@GetUser() user: any) {
        return this.usersService.findOne(user.userId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.GESTOR)
    @ApiOperation({ summary: 'Ver detalle de un trabajador' })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(':id/status')
    @Roles(Role.ADMIN)
    @ApiOperation({
        summary: 'Cambiar estado de un trabajador (Activo/Inactivo)',
    })
    updateEstado(
        @Param('id') id: string,
        @Body('estado') estado: 'ACTIVO' | 'INACTIVO',
    ) {
        return this.usersService.updateEstado(id, estado);
    }
}
