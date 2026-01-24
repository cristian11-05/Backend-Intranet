import { Module } from '@nestjs/common';
import { JustificationsService } from './justifications.service';
import { JustificationsController } from './justifications.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [JustificationsController],
    providers: [JustificationsService, PrismaService],
})
export class JustificationsModule { }
