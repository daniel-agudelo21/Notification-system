import { Injectable } from '@nestjs/common';
import { Notification, Channel } from '../../generated/prisma/client';
import { ChannelSender, SendContext, SendResult } from './channels.types';

@Injectable()
export class SmsSender implements ChannelSender {
  supports(channel: Channel): boolean {
    return channel === Channel.SMS;
  }
  async send(ctx: SendContext): Promise<SendResult> {
    const contentLength = ctx.notification.content.length;

    // 2) Registrar número y fecha (simulado). Aquí no tenemos phone en User,
    // así que lo dejamos como "not-provided" para el challenge.
    return {
      status: 'SENT',
      metadata: {
        phone: 'not-provided',
        sentAt: new Date().toISOString(),
        length: contentLength,
      },
    };
  }
}
