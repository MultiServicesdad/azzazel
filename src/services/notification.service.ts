import { prisma } from '@/lib/prisma';

// ═══════════════════════════════════════════════════════════
// AZAZEL OSINT — Notification Service
// ═══════════════════════════════════════════════════════════

export type NotificationType = 'SYSTEM' | 'INFO' | 'WARNING' | 'ALERT';
export type NotificationSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';

export async function createNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: any;
}) {
  return prisma.notification.create({
    data: {
      userId: params.userId,
      type: params.type as any,
      title: params.title,
      message: params.message,
      link: params.link,
      metadata: params.metadata || {},
    },
  });
}

export async function getNotifications(userId: string, unreadOnly = false) {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { read: false } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

export async function markAsRead(notificationId: string) {
  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function deleteNotification(notificationId: string) {
  return prisma.notification.delete({
    where: { id: notificationId },
  });
}
