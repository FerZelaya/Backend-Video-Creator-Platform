import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  User,
  UserInput,
  UserLoginCredentials,
} from '../../models/users.entity';
import { UserService } from './users.service';
import { JwtAuthGuard } from '../authorization/authorization.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from '../authorization/refreshToken.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logoutUser(@Req() request: Request): Promise<void> {
    await this.userService.logout(request.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.userService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow/:creatorId')
  async followCreator(
    @Param('creatorId') creatorId: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return await this.userService.addFollower(request.user['sub'], creatorId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unfollow/:creatorId')
  async funFollowCreator(
    @Param('creatorId') creatorId: number,
    @Req() request: Request,
  ): Promise<boolean> {
    return await this.userService.removeFollower(
      request.user['sub'],
      creatorId,
    );
  }

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
  async createUser(@Body() user: UserInput): Promise<object> {
    try {
      return await this.userService.create(user);
    } catch (error) {
      throw error;
    }
  }
}
