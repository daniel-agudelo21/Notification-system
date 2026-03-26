import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'The username to login',
    example: 'username123',
  })
  @IsNotEmpty()
  username: string;

  @ApiPropertyOptional({
    description: `The user's email`,
    example: 'example@example.com',
  })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({
    description: 'The password of the user',
    example: 'Password123',
  })
  @IsNotEmpty()
  password: string;
}
