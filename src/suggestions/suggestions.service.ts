import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class SuggestionsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly notificationsService: NotificationsService
    ) { }

    async create(createSuggestionDto: CreateSuggestionDto, attachments?: { ruta_archivo: string, tipo_archivo: string }[]) {
        const { usuario_id, area_id, tipo, titulo, descripcion } = createSuggestionDto;

        const [suggestion, areas] = await Promise.all([
            this.prisma.suggestions.create({
                data: {
                    usuario_id,
                    area_id,
                    tipo,
                    titulo,
                    descripcion,
                    estado: 0,
                    adjuntos: {
                        create: attachments || []
                    }
                },
                include: {
                    users: { select: { nombre: true, email: true } },
                    reviewer: { select: { nombre: true } },
                    adjuntos: true
                }
            }),
            this.prisma.areas.findMany()
        ]);

        return this.mapSuggestion(suggestion, areas);
    }

    async findAll(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [suggestions, total, areas] = await Promise.all([
            this.prisma.suggestions.findMany({
                skip,
                take: limit,
                include: {
                    users: { select: { nombre: true, email: true } },
                    reviewer: { select: { nombre: true } },
                    adjuntos: true
                },
                orderBy: { fecha_creacion: 'desc' }
            }),
            this.prisma.suggestions.count(),
            this.prisma.areas.findMany()
        ]);

        const data = suggestions.map(s => this.mapSuggestion(s, areas));

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        };
    }

    async updateStatus(id: number, state: number, adminId: number, comment?: string) {
        // 1. Fetch current status to avoid redundant updates
        const currentSuggestion = await this.prisma.suggestions.findUnique({
            where: { id },
            select: { estado: true, usuario_id: true }
        });

        if (!currentSuggestion) {
            throw new Error('Suggestion not found');
        }

        // If it's already in the target state, just return the detailed info without updating or notifying
        if (currentSuggestion.estado === state) {
            return this.getDetailedSuggestion(id);
        }

        // 2. Perform update
        const suggestion = await this.prisma.suggestions.update({
            where: { id },
            data: {
                estado: state,
                comentario_admin: comment || null,
                revisado_por: adminId,
                fecha_revision: new Date(),
                fecha_actualizacion: new Date()
            },
            include: {
                users: { select: { nombre: true, email: true } },
                reviewer: { select: { nombre: true } },
                adjuntos: true
            }
        });

        if (suggestion && state === 1) {
            try {
                await this.notificationsService.sendPushNotification(
                    suggestion.usuario_id,
                    'Sugerencia Revisada',
                    'Tu sugerencia ha sido leída por la administración. ¡Gracias por participar!'
                );
            } catch (e) {
                console.error('Error sending push notification:', e);
            }
        }

        return this.getDetailedSuggestion(id);
    }

    private async getDetailedSuggestion(id: number) {
        const [suggestion, areas] = await Promise.all([
            this.prisma.suggestions.findUnique({
                where: { id },
                include: {
                    users: { select: { nombre: true, email: true } },
                    reviewer: { select: { nombre: true } },
                    adjuntos: true
                }
            }),
            this.prisma.areas.findMany()
        ]);

        if (!suggestion) return null;
        return this.mapSuggestion(suggestion, areas);
    }

    private mapSuggestion(s: any, areas: any[]) {
        const area = areas.find(a => a.id === s.area_id);
        const mapped = {
            ...s,
            usuario_nombre: s.users?.nombre || null,
            usuario_email: s.users?.email || null,
            area_nombre: area?.nombre || null,
            revisado_por_nombre: s.reviewer?.nombre || null,
            user: {
                nombre: s.users?.nombre || null,
                email: s.users?.email || null
            },
            revisado_por_user: s.reviewer ? {
                nombre: s.reviewer.nombre
            } : null,
            adjunto_url: s.adjuntos && s.adjuntos.length > 0 ? s.adjuntos[0].ruta_archivo : null,
            adjuntos: s.adjuntos || []
        };

        // Remove Prisma objects to match legacy raw SQL structure exactly
        delete mapped.users;
        delete mapped.areas;
        delete mapped.reviewer;

        return mapped;
    }
}
