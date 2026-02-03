import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getStats() {
        // Justifications stats
        // estado: 0=pendiente, 1=aprobado, 2=rechazado
        const justificationsTotal = await this.prisma.justifications.count();
        const justificationsApproved = await this.prisma.justifications.count({
            where: { estado: 1 },
        });
        const justificationsPending = await this.prisma.justifications.count({
            where: { estado: 0 },
        });
        const justificationsRejected = await this.prisma.justifications.count({
            where: { estado: 2 },
        });

        // Suggestions stats
        // The frontend groups them into 'Total General', 'Reporte de situación', 'Te escuchamos'
        const suggestionsTotal = await this.prisma.suggestions.count();

        // Note: Checking the exact string for 'tipo' as seen in the controller
        const suggestionsReporte = await this.prisma.suggestions.count({
            where: { tipo: 'Reporte de situación' },
        });
        const suggestionsTeEscuchamos = await this.prisma.suggestions.count({
            where: { tipo: 'Te escuchamos' },
        });

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
