import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { CreateJustificationDto } from './dto/create-justification.dto';
import { UpdateJustificationDto } from './dto/update-justification.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@ApiTags('Justifications')
@Controller('justifications')
export class JustificationsController {
    constructor(private readonly justificationsService: JustificationsService) { }

    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
                return cb(null, `${randomName}${extname(file.originalname)}`);
            }
        })
    }))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Create a new justification with multiple proof files' })
    @ApiResponse({ status: 201, description: 'The justification has been successfully created.' })
    async create(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() createJustificationDto: CreateJustificationDto
    ) {
        const filePaths = files?.map(file => `/uploads/${file.filename}`) || [];
        const data = { ...createJustificationDto, files: filePaths };

        return this.justificationsService.create(data as any);
    }

    @Get()
    @ApiOperation({ summary: 'Get all justifications' })
    @ApiResponse({ status: 200, description: 'Return all justifications.' })
    findAll() {
        return this.justificationsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a justification by id' })
    @ApiResponse({ status: 200, description: 'Return the justification.' })
    findOne(@Param('id') id: string) {
        return this.justificationsService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a justification' })
    @ApiResponse({ status: 200, description: 'The justification has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateJustificationDto: UpdateJustificationDto) {
        return this.justificationsService.update(+id, updateJustificationDto as any);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a justification' })
    @ApiResponse({ status: 200, description: 'The justification has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.justificationsService.remove(+id);
    }
}
