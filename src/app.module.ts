import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { UsersModule } from './modules/users/user.module';

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
      entities: ['./build/**/*.entity.js'],
    }),
    UsersModule,
    AuthorizationModule,
  ],
})
export class AppModule {}
