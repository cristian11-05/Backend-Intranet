import { Module } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { JustificationsController } from './justifications.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { StorageService } from '../common/services/storage.service';

@Module({
    imports: [PrismaModule],
    controllers: [JustificationsController],
    providers: [JustificationsService, StorageService],
    exports: [JustificationsService],
})
export class JustificationsModule { }
