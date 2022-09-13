import { Type } from 'class-transformer';
import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from './Base.entity';

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
}

export class UserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  photoUrl: string;
}

export class UserLoginCredentials {
  email: string;
  password: string;
}
