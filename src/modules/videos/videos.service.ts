import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/users.entity';
import { Video, VideoInput } from 'src/models/Video.entity';
import { Repository } from 'typeorm';
import { UserService } from '../users/users.service';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Video)
    private readonly videosRepo: Repository<Video>,
    private readonly userService: UserService,
  ) {}

  async findAllPublished(): Promise<Video[]> {
    return await this.videosRepo.find({
      relations: { User: true },
      order: {
        created: 'ASC',
      },
      select: {
        title: true,
        videoUrl: true,
        published: true,
      },
      where: {
        published: true,
      },
    });
  }

  async createVideo(data: VideoInput, user: User): Promise<Video> {
    const videoCreated = await this.videosRepo.create(data);
    videoCreated.User = user;
    return this.videosRepo.save(videoCreated);
  }

  async findVideosByUserId(id: number): Promise<Video[]> {
    const videos = await this.videosRepo.find({
      relations: { User: true },
      order: {
        created: 'ASC',
      },
      select: {
        title: true,
        videoUrl: true,
        published: true,
        User: {},
      },
      where: {
        User: {
          id: id,
        },
      },
    });
    if (!videos) {
      throw new NotFoundException(`Video with provided user id not found`);
    }
    return videos;
  }
  async findOneVideoByUserId(videoId: number, userId: number): Promise<Video> {
    const video = await this.videosRepo.find({
      relations: { User: true },
      order: {
        created: 'ASC',
      },
      select: {
        title: true,
        videoUrl: true,
        published: true,
        User: {},
      },
      where: {
        User: {
          id: userId,
        },
        id: videoId,
      },
    });
    if (!video) {
      throw new NotFoundException(`Video with provided user id not found`);
    }
    return video[0];
  }

  async pulishOrUnpublishVideo(
    videoId: number,
    userId: number,
  ): Promise<boolean> {
    const video = await this.findOneVideoByUserId(videoId, userId);
    if (!video) {
      throw new NotFoundException(`Video with provided user id not found`);
    }
    video.published = !video.published;
    const result = await this.videosRepo.update(videoId, video);
    return result.affected === 1 ? true : false;
  }
  async likeAVideo(videoId: number, user: User): Promise<boolean> {
    const video = await this.findVideoById(videoId);
    if (!video) {
      throw new NotFoundException(`Video with provided id not found`);
    }
    const likeVideos = await this.userService.addLikeVideo(user.id, video);
    return likeVideos ? true : false;
  }

  async findVideoById(id: number): Promise<Video> {
    return await this.videosRepo.findOneBy({ id });
  }
}
