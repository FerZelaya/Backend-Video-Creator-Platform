import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { UsersModule } from './modules/users/user.module';
import { VideosModule } from './modules/videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'VCP-Database',
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
      entities: ['./dist/**/*.entity.js'],
    }),
    UsersModule,
    AuthorizationModule,
    VideosModule,
  ],
})
export class AppModule {}
