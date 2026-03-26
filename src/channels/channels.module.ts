import { Module } from '@nestjs/common';
import { EmailSender } from './email.sender';
import { SmsSender } from './sms.sender';
import { PushSender } from './push.sender';
import { NotificationDispatcher } from './notification-dispatcher.service';

@Module({
  providers: [
    EmailSender,
    SmsSender,
    PushSender,
    {
      provide: NotificationDispatcher,
      useFactory: (email: EmailSender, sms: SmsSender, push: PushSender) =>
        new NotificationDispatcher([email, sms, push]),
      inject: [EmailSender, SmsSender, PushSender],
    },
  ],
  exports: [NotificationDispatcher],
})
export class ChannelsModule {}
