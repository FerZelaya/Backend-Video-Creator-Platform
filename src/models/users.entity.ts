import { Type } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { Video } from './Video.entity';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @Column({ name: 'firstName', nullable: false })
  firstName: string;

  @Column({ name: 'lastName', nullable: false })
  lastName: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'photoUrl', nullable: false })
  photoUrl: string;

  @OneToMany(() => Video, (video) => video.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  Videos: Video[];

  @Column({
    name: 'likedVideos',
    nullable: true,
    array: false,
    default: () => "'[]'",
    type: 'jsonb',
  })
  likedVideos?: Array<Video>;

  @Column({
    name: 'followers',
    nullable: true,
    array: false,
    type: 'simple-array',
  })
  followers?: Array<number>;

  @Column({ name: 'refreshToken', nullable: true })
  refreshToken: string;
}

export class UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoUrl: string;
  refreshToken: string;
}

export class UserLoginCredentials {
  email: string;
  password: string;
}
