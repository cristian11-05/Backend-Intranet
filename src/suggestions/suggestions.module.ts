import { Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [SuggestionsController],
    providers: [SuggestionsService, PrismaService],
})
export class SuggestionsModule { }
