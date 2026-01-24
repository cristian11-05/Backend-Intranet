import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SuggestionsService {
    constructor(
        private prisma: PrismaService,
        private notificationsService: NotificationsService
    ) { }

    async create(data: Prisma.SuggestionCreateInput) {
        return this.prisma.suggestion.create({
            data,
        });
    }

    async findAll() {
        return this.prisma.suggestion.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: number) {
        return this.prisma.suggestion.findUnique({
            where: { id },
            include: { user: true }
        });
    }

    async update(id: number, data: Prisma.SuggestionUpdateInput) {
        const suggestion = await this.prisma.suggestion.update({
            where: { id },
            data,
            include: { user: true }
        });

        if (data.status === 'RECHAZADO' || data.status === 'APROBADO') {
            await this.notificationsService.notifyStatusChange(suggestion.userId, suggestion.type, data.status as string);
        }

        return suggestion;
    }

    async remove(id: number) {
        return this.prisma.suggestion.delete({
            where: { id },
        });
    }
}
