import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NotificationsDto {
  @ApiProperty({
    description: 'The unique id by notification',
    example: '123-456-asdf',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: `Title of the notification`,
    example: `Title example`,
  })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: `Content of the notification`,
    example: 'Content example',
  })
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'User id related to the notification',
    example: '123-456-asdg',
  })
  user: string;

  @ApiProperty({
    description: `Channel of the notification`,
    example: `facebook`,
  })
  @IsNotEmpty()
  channel: string;
}
