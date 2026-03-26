import { Injectable } from '@nestjs/common';
import { Channel } from '../../generated/prisma/client';
import { ChannelSender, SendContext, SendResult } from './channels.types';

@Injectable()
export class EmailSender implements ChannelSender {
  supports(channel: Channel): boolean {
    return channel === Channel.EMAIL;
  }

  private buildTemplate(ctx: SendContext): string {
    return `<html>
        <body>
          <h1>${ctx.notification.title}</h1>
          <p>${ctx.notification.content}</p>
        </body>
      </html>
    `.trim();
  }

  async send(ctx: SendContext): Promise<SendResult> {
    const html = this.buildTemplate(ctx);
    return {
      status: 'SENT',
      metadata: {
        provider: 'fake-smtp',
        recipient: ctx.userEmail,
        subject: ctx.notification.title,
        templateGenerated: true,
        renderedBytes: html.length,
        sentAt: new Date().toISOString(),
      },
    };
  }
}
