import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Channel } from '../../generated/prisma/client';
import { ChannelSender, SendContext } from './channels.types';

@Injectable()
export class NotificationDispatcher {
  private readonly senders: ChannelSender[];

  constructor(senders: ChannelSender[]) {
    this.senders = senders;
  }

  dispatch(channel: Channel, ctx: SendContext) {
    const sender = this.senders.find((s) => s.supports(channel));
    if (!sender)
      throw new InternalServerErrorException(
        `No sender for channel: ${channel}`,
      );
    return sender.send(ctx);
  }
}
