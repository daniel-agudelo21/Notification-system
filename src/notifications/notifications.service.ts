import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationDispatcher } from '../channels/notification-dispatcher.service';
import {
  Channel,
  Notification,
  StatusNotification,
} from '../../generated/prisma/client';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dispatcher: NotificationDispatcher,
  ) {}
  private validateNotificationByChannel(
    dto: CreateNotificationDto,
    userEmail: string,
  ): void {
    if (dto.channel === Channel.SMS && dto.content.length > 160) {
      throw new BadRequestException(
        'Message too large, it must be less than or equal to 160 characters',
      );
    }

    if (
      dto.channel === Channel.EMAIL &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)
    ) {
      throw new BadRequestException('Invalid email format');
    }

    if (dto.channel === Channel.PUSH) {
      const fakeDeviceToken = 'fake-device-token';
      if (fakeDeviceToken.length < 10) {
        throw new BadRequestException('Invalid device token');
      }
    }
  }

  async createNotification(
    userId: string,
    userEmail: string,
    dto: CreateNotificationDto,
  ) {
    this.validateNotificationByChannel(dto, userEmail);
    const notificaiton = await this.prisma.notification.create({
      data: {
        userId,
        title: dto.title,
        content: dto.content,
        channel: dto.channel,
        status: StatusNotification.FAILED,
      },
    });
    try {
      const result = await this.dispatcher.dispatch(dto.channel, {
        userEmail,
        userId,
        notification: {
          id: notificaiton.id,
          title: notificaiton.title,
          content: notificaiton.content,
          channel: notificaiton.channel,
        },
      });
      const updated = await this.prisma.notification.update({
        where: { id: notificaiton.id },
        data: {
          status:
            result.status === 'SENT'
              ? StatusNotification.SENT
              : StatusNotification.FAILED,
          metadata: result.metadata ?? undefined,
        },
      });
      return updated;
    } catch (error) {
      return await this.prisma.notification.update({
        where: { id: notificaiton.id },
        data: {
          status: StatusNotification.FAILED,
          metadata: {
            reason: 'Dispatcher execution failed',
            error,
          },
        },
      });
    }
  }

  async finAllNotifiications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async assertOwnership(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification) throw new NotFoundException('Notification not found');
    if (notification.userId !== userId)
      throw new ForbiddenException('Not your notification');
    return notification;
  }
  async updateNotification(
    userId: string,
    notificationId: string,
    dto: UpdateNotificationDto,
  ): Promise<Notification> {
    await this.assertOwnership(userId, notificationId);
    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { ...dto },
    });
  }

  async deleteNotification(
    userId: string,
    notificationId: string,
  ): Promise<Notification> {
    await this.assertOwnership(userId, notificationId);
    const notification = await this.prisma.notification.delete({
      where: { id: notificationId },
    });
    if (!notification)
      throw new NotFoundException(
        `notification with id: ${notificationId} not found`,
      );
    return notification;
  }
}
