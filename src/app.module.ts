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
      port: 5432,
      url: process.env.DATABASE_URL,
      synchronize: true,
      autoLoadEntities: true,
      logging: false,
      migrationsRun: true,
      entities: ['./dist/**/*.entity.js'],
      migrations: ['./dist/src/migration/**/*.js'],
      ssl: {
        rejectUnauthorized: false,
      },
      migrationsTableName: 'mirgations',
    }),
    UsersModule,
    AuthorizationModule,
    VideosModule,
  ],
})
export class AppModule {}
