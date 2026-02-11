import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        // Justifications stats
        // estado: 0=pendiente, 1=aprobado, 2=rechazado
        // Justifications stats (0=pendiente, 1=aprobado, 2=rechazado)
        const justStats = await this.prisma.justifications.groupBy({
            by: ['estado'],
            _count: { id: true }
        });

        const getJustCount = (status: number) => justStats.find(s => s.estado === status)?._count.id || 0;
        const justificationsTotal = justStats.reduce((acc, curr) => acc + curr._count.id, 0);

        const justificationsApproved = getJustCount(1);
        const justificationsPending = getJustCount(0);
        const justificationsRejected = getJustCount(2);

        // Suggestions stats
        const sugStats = await this.prisma.suggestions.groupBy({
            by: ['tipo'],
            _count: { id: true }
        });

        const getSugCount = (tipo: string) => sugStats.find(s => s.tipo === tipo)?._count.id || 0;
        const suggestionsTotal = sugStats.reduce((acc, curr) => acc + curr._count.id, 0);

        const suggestionsReporte = getSugCount('Reporte de situación');
        const suggestionsTeEscuchamos = getSugCount('Te escuchamos');

        return {
            totalJustificaciones: justificationsTotal,
            aprobadas: justificationsApproved,
            pendientes: justificationsPending,
            rechazadas: justificationsRejected,
            totalSugerencias: suggestionsTotal,
            reporteSituacion: suggestionsReporte,
            teEscuchamos: suggestionsTeEscuchamos,
            // Mantener estructura anterior por si acaso
            justifications: {
                total: justificationsTotal,
                approved: justificationsApproved,
                pending: justificationsPending,
                rejected: justificationsRejected,
            },
            suggestions: {
                total: suggestionsTotal,
                reporte: suggestionsReporte,
                te_escuchamos: suggestionsTeEscuchamos,
            },
        };
    }
}
