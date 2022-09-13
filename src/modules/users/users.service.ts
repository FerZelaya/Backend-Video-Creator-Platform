import {
  ConflictException,
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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtTokenService: JwtService,
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

  async create(data: UserInput): Promise<User> {
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
    return this.userRepo.save(userCreated);
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
    const payload = { username: user.email, sub: userDB.id };
    return {
      access_token: this.jwtTokenService.sign(payload),
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
}
