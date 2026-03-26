import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async findAllUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`user with id: ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    if (!user)
      throw new NotFoundException(`user with email: ${email} not found`);
    return user;
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({ data });
  }

  async createAuthUser(
    name: string,
    email: string,
    password: string,
  ): Promise<Pick<User, 'id' | 'name' | 'email' | 'createdAt'>> {
    return this.prisma.user.create({
      data: {
        name,
        email,
        password,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    if (!user) throw new NotFoundException(`user with id: ${id} not found`);
    return user;
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    if (!user) throw new NotFoundException(`user with id: ${id} not found`);
    return user;
  }
}
