import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/constants';
import { User } from 'src/models/users.entity';
import { JwtStrategy } from '../authorization/jwt.strategy';
import { RefreshTokenStrategy } from '../authorization/refreshToken.strategy';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule.register({})],
  controllers: [UserController],
  providers: [UserService, JwtStrategy, RefreshTokenStrategy, ConfigService],
})
export class UsersModule {}
