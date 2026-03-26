import { Notification, Channel, Prisma } from '../../generated/prisma/client';

export type SendContext = {
  notification: Pick<Notification, 'id' | 'title' | 'content' | 'channel'>;
  userEmail: string;
  userId: string;
};
export type SendResult = {
  status: 'SENT' | 'FAILED';
  metadata?: Prisma.InputJsonValue;
};

export interface ChannelSender {
  supports(channel: Channel): boolean;
  send(ctx: SendContext): Promise<SendResult>;
}
