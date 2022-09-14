import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import RequestWithUser from 'src/constants/requestWithUser.interface';
import { Video, VideoInput } from 'src/models/Video.entity';
import { JwtAuthGuard } from '../authorization/authorization.guard';
import { VideosService } from './videos.service';

@Controller('videos')
@UseGuards(JwtAuthGuard)
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get('')
  async getAllPublishedVideos(): Promise<Video[]> {
    return await this.videosService.findAllPublished();
  }

  @Post('')
  async postVideo(
    @Body() video: VideoInput,
    @Req() request: RequestWithUser,
  ): Promise<Video> {
    try {
      return await this.videosService.createVideo(video, request.user.user);
    } catch (error) {
      throw error;
    }
  }

  @Get('getAll/:userId')
  async getAllVideosFromUser(
    @Req() request: RequestWithUser,
  ): Promise<Video[]> {
    return await this.videosService.findVideosByUserId(request.user.user.id);
  }

  @Get('publish/:videoId')
  async publishOrUnpublishVideo(
    @Param('videoId') videoId: number,
    @Req() request: RequestWithUser,
  ): Promise<boolean> {
    return await this.videosService.pulishOrUnpublishVideo(
      videoId,
      request.user.user.id,
    );
  }

  @Post('like/:videoId')
  async likeVideo(
    @Param('videoId') videoId: number,
    @Req() request: RequestWithUser,
  ): Promise<boolean> {
    return await this.videosService.likeAVideo(videoId, request.user.user);
  }
}
