import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({
    description: 'The user has been successfully logged in',
    type: LoginDto,
  })
  login(@Body() dto: LoginDto) {
    return this.auth.loginService(dto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register of users' })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: 'The user has been registered successfully',
    type: RegisterDto,
  })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }
}
