import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';
import { Channel } from '../../../generated/prisma/client';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'The title of the notification',
    example: 'example of title',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title!: string;

  @ApiProperty({
    description: 'The content of the notification',
    example: 'example of content',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  content!: string;

  @ApiProperty({
    description: 'The channel of the notification',
    example: 'SMS',
  })
  @IsEnum(Channel)
  channel!: Channel;
}
