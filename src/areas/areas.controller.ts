import { Controller, Get } from '@nestjs/common';
import { AreasService } from './areas.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Areas')
@Controller('areas')
export class AreasController {
    constructor(private readonly areasService: AreasService) { }

    @Get()
    @ApiOperation({ summary: 'Get all areas' })
    @ApiResponse({ status: 200, description: 'Return all areas.' })
    async findAll() {
        const data = await this.areasService.findAll();
        return {
            status: true,
            data
        };
    }
}
