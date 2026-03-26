import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { NotificationEntity } from './notifications.entity';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  NotificationsDto,
} from './dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../users/users.decorator';

@ApiTags('Notifications')
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({ type: CreateNotificationDto })
  @ApiCreatedResponse({
    description: 'The notification has been successfully created',
    type: NotificationsDto,
  })
  async createNotification(
    @User('userId') userId: string,
    @User('email') userEmail: string,
    @Body() dto: CreateNotificationDto,
  ): Promise<NotificationEntity> {
    const notification = await this.notifications.createNotification(
      userId,
      userEmail,
      dto,
    );
    if (!userId) throw new BadRequestException('User does not assigned');
    return new NotificationEntity(notification);
  }

  @Put(':notificationId')
  @ApiOperation({ summary: 'Update the notification by id' })
  @ApiParam({ name: 'notificationId', description: 'the notification id' })
  @ApiBody({ type: UpdateNotificationDto })
  @ApiOkResponse({
    description: 'The notification has been successfully updated',
    type: UpdateNotificationDto,
  })
  async updateNotification(
    @User('userId') userId: string,
    @Param('notificationId') notificationId: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ): Promise<NotificationEntity> {
    try {
      return await this.notifications.updateNotification(
        userId,
        notificationId,
        updateNotificationDto,
      );
    } catch (error) {
      throw new BadRequestException(error || 'Notification does not exist');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get notifications by userId' })
  @ApiOkResponse({
    description: 'Return the notificiations by userId',
    type: NotificationsDto,
  })
  async notificationsByUsers(
    @User('userId') userId: string,
  ): Promise<NotificationEntity[]> {
    try {
      const notification =
        await this.notifications.finAllNotifiications(userId);
      return notification;
    } catch (error) {
      throw new BadRequestException(error || 'User does not exist');
    }
  }
  @Delete(':notificationId')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiParam({ name: 'notificationId', description: 'The notification id' })
  @ApiOkResponse({
    description: 'The notification has been successfully deleted',
  })
  async deleteNotification(
    @User('userId') userId: string,
    @Param('notificationId') notificationId: string,
  ) {
    try {
      const deleted = await this.notifications.deleteNotification(
        userId,
        notificationId,
      );
      return new NotificationEntity(deleted);
    } catch (error) {
      throw new BadRequestException(error || 'Notification does not exist');
    }
  }
}
