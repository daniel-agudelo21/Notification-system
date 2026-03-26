import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './users.entity';
import { CreateUserDto, UpdateUserDto, UsersDto } from './dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guards';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiOkResponse({
    description: 'Return all users',
    type: UsersDto,
    isArray: true,
  })
  async findUsers(): Promise<UserEntity[]> {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiOkResponse({
    description: 'Return the user with the specific id',
    type: UsersDto,
  })
  async findUserById(@Param('id') id: string): Promise<UserEntity> {
    try {
      return await this.userService.findUserById(id);
    } catch (error) {
      throw new BadRequestException(error || 'User does not exist');
    }
  }

  @UseGuards(AuthGuard)
  @Get('/email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiParam({ name: 'email', description: 'The user email' })
  @ApiOkResponse({
    description: 'Return the user with the specific email',
    type: UsersDto,
  })
  async findUserByEmail(@Param('email') email: string): Promise<UserEntity> {
    return await this.userService.findByEmail(email);
  }
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created',
    type: UsersDto,
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userService.createUser(createUserDto);
    return new UserEntity(user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update the user by id' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({
    description: 'The user has been succesfull updated',
    type: UpdateUserDto,
  })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      throw new BadRequestException(error || 'User does not exist');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'The user id' })
  @ApiOkResponse({ description: 'The user has been successfully deleted' })
  async deleteUser(@Param('id') id: string): Promise<UserEntity> {
    try {
      return await this.userService.deleteUser(id);
    } catch (error) {
      throw new BadRequestException(error || 'User does not exist');
    }
  }
}
