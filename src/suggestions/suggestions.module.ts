import { Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageService } from '../common/services/storage.service';

@Module({
    imports: [PrismaModule],
    controllers: [SuggestionsController],
    providers: [SuggestionsService, StorageService],
    exports: [SuggestionsService],
})
export class SuggestionsModule { }
