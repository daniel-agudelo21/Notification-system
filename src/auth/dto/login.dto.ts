import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'jhon@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthUserDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '123456',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'jhondoe@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The name of the user',
    example: 'Jhon Doe',
  })
  @IsString()
  name: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'The accessToken',
    example: 'fake-token-1234',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'The user authenticated',
    example: 'jhonDoe',
  })
  user: AuthUserDto;
}
