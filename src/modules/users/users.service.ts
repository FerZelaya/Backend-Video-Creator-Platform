import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  User,
  UserInput,
  UserLoginCredentials,
} from '../../models/users.entity';
import { JwtService } from '@nestjs/jwt';
import { Video } from 'src/models/Video.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtTokenService: JwtService,
    private configService: ConfigService,
  ) {}

  async findById(id: number): Promise<User> {
    return await this.userRepo.findOneBy({ id });
  }

  async findByemail(email: string): Promise<User> {
    const user = await this.userRepo.findOne({
      select: ['email', 'id', 'firstName', 'lastName', 'password'],
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException(`User with provided email not found`);
    }
    return user;
  }

  async create(data: UserInput): Promise<object> {
    const userExists = await this.userRepo.findOne({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
      );
    }
    const hashedPassword = await this.hashPassword(data.password);
    data.password = hashedPassword;
    const userCreated = await this.userRepo.create(data);
    await this.userRepo.save(userCreated);
    const tokens = await this.getTokens(userCreated.id, userCreated);
    await this.updateRefreshToken(userCreated.id, tokens.refreshToken);
    return tokens;
  }

  async logInWithCredentials(user: UserLoginCredentials): Promise<object> {
    const userDB = await this.findByemail(user.email);
    const correctPassword = await this.comparePassword(
      user.password,
      userDB.password,
    );
    if (!userDB || !correctPassword) {
      throw new ConflictException(`Email or Password is incorrect!`);
    }
    const tokens = await this.getTokens(userDB.id, userDB);
    await this.updateRefreshToken(userDB.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: number) {
    return this.userRepo.update({ id: userId }, { refreshToken: null });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied');
    }
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashPassword(refreshToken);
    await this.userRepo.update(
      { id: userId },
      {
        refreshToken: hashedRefreshToken,
      },
    );
  }

  async getTokens(userId: number, username: object) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtTokenService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtTokenService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
  async comparePassword(password: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  }

  async addLikeVideo(userId: number, video: Video): Promise<any[]> {
    const user = await this.findById(userId);
    if (user.likedVideos !== null) {
      const newVideos: Video[] = [...user.likedVideos];
      newVideos.push(video);
      user.likedVideos = newVideos;
    } else {
      user.likedVideos = [video];
    }
    const result = await this.userRepo.save(user);

    return result.likedVideos;
  }

  async addFollower(userId: number, creatorId: number): Promise<boolean> {
    const creator = await this.findById(creatorId);
    if (!creator) {
      throw new ConflictException(`Creator with id: ${creatorId} not found!`);
    }
    if (creator.followers !== null) {
      const newFollowers: number[] = [...creator.followers];
      newFollowers.push(userId);
      creator.followers = newFollowers;
    } else {
      creator.followers = [creator.id];
    }
    const result = await this.userRepo.save(creator);

    return result.followers ? true : false;
  }

  async removeFollower(userId: number, creatorId: number): Promise<boolean> {
    const creator = await this.findById(creatorId);
    if (!creator) {
      throw new ConflictException(`Creator with id: ${creatorId} not found!`);
    }
    if (creator.followers !== null) {
      const newFollowers: number[] = this.removeItemOnce(
        creator.followers,
        userId.toString(),
      );

      creator.followers = newFollowers;
    } else {
      creator.followers = [creator.id];
    }
    const result = await this.userRepo.save(creator);

    return result.followers ? true : false;
  }

  removeItemOnce = (arr, value: string) => {
    const index = arr.indexOf(value);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  };
}
