import { Module, Global } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';

@Global()
@Module({
    providers: [NotificationsService, PrismaService],
    exports: [NotificationsService],
})
export class NotificationsModule { }
