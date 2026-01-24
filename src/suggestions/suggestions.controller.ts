import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { Prisma } from '@prisma/client';

@Controller('suggestions')
export class SuggestionsController {
    constructor(private readonly suggestionsService: SuggestionsService) { }

    @Post()
    create(@Body() createSuggestionDto: Prisma.SuggestionCreateInput) {
        return this.suggestionsService.create(createSuggestionDto);
    }

    @Get()
    findAll() {
        return this.suggestionsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.suggestionsService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateSuggestionDto: Prisma.SuggestionUpdateInput) {
        return this.suggestionsService.update(+id, updateSuggestionDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.suggestionsService.remove(+id);
    }
}
