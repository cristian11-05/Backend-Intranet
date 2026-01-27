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
        // Validation logic for default password and email if not provided
        // Note: DTO validation happens before this method is called
        if (!createUserDto.password && createUserDto.documento) {
            createUserDto.password = createUserDto.documento;
        }

        if (!createUserDto.email && createUserDto.documento) {
            createUserDto.email = `${createUserDto.documento}@sistema.com`;
        }

        // We need to cast to any or match the strict type if prisma expects strict types
        // The service expects Prisma.UserCreateInput, which our DTO is compatible with (mostly)
        // Ideally we map DTO to Entity/Input here.
        return this.usersService.create(createUserDto as any);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a user' })
    @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
    async remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}
