import { ApiProperty } from '@nestjs/swagger';

export class NotificationEntity {
  @ApiProperty({
    description: 'The unique id by notification',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'The unique id by user',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  userId: string;

  @ApiProperty({
    description: 'The unique channel',
    example: 'SMS',
  })
  channel: string;

  @ApiProperty({
    description: 'The title of the notification',
    example: 'Title example',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the notification',
    example: 'Content example',
  })
  content: string;

  constructor(partial: Partial<NotificationEntity>) {
    if (partial) Object.assign(this, partial);
  }
}
