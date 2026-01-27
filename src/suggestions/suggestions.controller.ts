import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';

@ApiTags('Suggestions')
@Controller('suggestions')
export class SuggestionsController {
    constructor(private readonly suggestionsService: SuggestionsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new suggestion or claim' })
    @ApiResponse({ status: 201, description: 'The suggestion has been successfully created.' })
    create(@Body() createSuggestionDto: CreateSuggestionDto) {
        return this.suggestionsService.create(createSuggestionDto as any);
    }

    @Get()
    @ApiOperation({ summary: 'Get all suggestions' })
    @ApiResponse({ status: 200, description: 'Return all suggestions.' })
    findAll() {
        return this.suggestionsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a suggestion by id' })
    @ApiResponse({ status: 200, description: 'Return the suggestion.' })
    findOne(@Param('id') id: string) {
        return this.suggestionsService.findOne(+id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a suggestion' })
    @ApiResponse({ status: 200, description: 'The suggestion has been successfully updated.' })
    update(@Param('id') id: string, @Body() updateSuggestionDto: UpdateSuggestionDto) {
        return this.suggestionsService.update(+id, updateSuggestionDto as any);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a suggestion' })
    @ApiResponse({ status: 200, description: 'The suggestion has been successfully deleted.' })
    remove(@Param('id') id: string) {
        return this.suggestionsService.remove(+id);
    }
}
