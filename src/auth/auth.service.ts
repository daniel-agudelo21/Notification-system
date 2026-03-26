import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '../../generated/prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto, LoginResponseDto } from './dto/login.dto';

interface ValidatedUser {
  id: string;
  email: string;
  name: string;
}

interface JwtPayload {
  sub: string;
  email: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  private async hashPassword(password: string): Promise<string> {
    const rounds = Number(process.env.BCRYPT_ROUNDS ?? '10');
    return bcrypt.hash(password, rounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  private async signIn(user: ValidatedUser): Promise<string> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.signAsync(payload);
  }

  async register(dto: RegisterDto) {
    debugger;
    try {
      const name = dto.name;
      const email = dto.email;
      const hashedPassword = await this.hashPassword(dto.password);
      return await this.usersService.createAuthUser(
        name,
        email,
        hashedPassword,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email alredy in use');
      }
      throw error;
    }
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<ValidatedUser | null> {
    const user = await this.usersService.findByEmail(email.toLowerCase());
    if (!user) return null;
    const isPasswordValid = await this.comparePasswords(pass, user.password);
    if (!isPasswordValid) return null;

    return { id: user.id, email: user.email, name: user.name };
  }

  async loginService(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const accessToken = await this.signIn(user);
    return { accessToken, user };
  }
}
