import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';
import { User } from './users.entity';

@Entity({ name: 'Video' })
export class Video extends BaseEntity {
  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'published', nullable: false })
  published: boolean;

  @Column({ name: 'videoUrl', nullable: false })
  videoUrl: string;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  User?: User;
}

export class VideoInput {
  title: string;
  videoUrl: string;
  published: boolean;
}
