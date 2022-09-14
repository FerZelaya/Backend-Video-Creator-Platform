import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/models/users.entity';
import { Video } from 'src/models/Video.entity';
import { UserService } from '../users/users.service';
import { VideosController } from './videos.controller';
import { VideosService } from './videos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Video, User])],
  controllers: [VideosController],
  providers: [VideosService, UserService, JwtService, ConfigService],
})
export class VideosModule {}
