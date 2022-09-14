import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  User,
  UserInput,
  UserLoginCredentials,
} from '../../models/users.entity';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../authorization/authorization.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getUser(@Param('id') userId: number): Promise<User> {
    return this.userService.findById(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get/email/:email')
  async findByEmail(@Param('email') email: string): Promise<User> {
    return await this.userService.findByemail(email);
  }

  @Post('sign-in')
  async signInWithCredentials(
    @Body() user: UserLoginCredentials,
  ): Promise<object> {
    return this.userService.logInWithCredentials(user);
  }

  @Post('sign-up')
  async createUser(@Body() user: UserInput): Promise<User> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      throw error;
    }
  }
}
