import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
    constructor(private prisma: PrismaService) { }

    async sendPushNotification(userId: number, title: string, body: string) {
        // 1. Get device tokens for the user
        const tokens = await this.prisma.deviceToken.findMany({
            where: { userId, isActive: true },
        });

        if (tokens.length === 0) {
            console.log(`[Notification] No active devices found for user ${userId}. Skipping push.`);
            return;
        }

        // 2. Mock sending notification
        // In a real app, use Firebase Admin (FCM) or OneSignal here.
        tokens.forEach(t => {
            console.log(`[Notification] Sending to device ${t.deviceName} (${t.token}):`);
            console.log(`   Title: ${title}`);
            console.log(`   Body: ${body}`);
        });

        // Future: Integrate with FCM
        // await firebaseAdmin.messaging().sendMulticast({...})
    }

    async notifyStatusChange(userId: number, type: string, status: string) {
        let title = 'Actualización de Estado';
        let body = `Su solicitud de ${type} ha sido actualizada a: ${status}`;

        if (status === 'RECHAZADO') {
            title = 'Solicitud Rechazada';
            body = `Su ${type} ha sido rechazado. Por favor revise los detalles.`;
        } else if (status === 'APROBADO') {
            title = 'Solicitud Aprobada';
            body = `Su ${type} ha sido aprobado exitosamente.`;
        }

        await this.sendPushNotification(userId, title, body);
    }
}
