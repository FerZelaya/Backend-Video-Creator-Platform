import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { UsersModule } from './modules/users/user.module';
import { VideosModule } from './modules/videos/videos.module';

@Module({
  imports: [
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
