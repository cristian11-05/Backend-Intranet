import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    sendPushNotification(userId: number, title: string, body: string): Promise<void>;
    notifyStatusChange(userId: number, type: string, status: string): Promise<void>;
}
