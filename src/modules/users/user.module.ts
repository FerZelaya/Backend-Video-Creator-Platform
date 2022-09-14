import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { jwtConstants } from 'src/constants/constants';
import { User } from 'src/models/users.entity';
import { JwtStrategy } from '../authorization/jwt.strategy';
import { UserController } from './users.controller';

import { UserService } from './users.service';
// import { Registration } from '../../models/registration.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10000s' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UsersModule {}
