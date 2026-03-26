import { Injectable } from '@nestjs/common';
import { Channel } from '../../generated/prisma/client';
import { ChannelSender, SendContext, SendResult } from './channels.types';

@Injectable()
export class PushSender implements ChannelSender {
  supports(channel: Channel): boolean {
    return channel === Channel.PUSH;
  }
  async send(ctx: SendContext): Promise<SendResult> {
    const payload = {
      title: ctx.notification.title,
      body: ctx.notification.channel,
      notificationId: ctx.notification.id,
    };
    return {
      status: 'SENT',
      metadata: {
        provider: 'fake-fcm',
        sentAt: new Date().toISOString(),
        payload,
      },
    };
  }
}
