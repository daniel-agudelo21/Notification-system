import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';
export class UsersDto {
  @ApiProperty({
    description: 'The unique id by user',
    example: 1,
  })
  id: string;

  @ApiProperty({
    description: 'The username to login',
    example: 'username123',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: `The user's email`,
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;
}
