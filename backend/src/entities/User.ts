import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Events } from './Event';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true, nullable: true })
  email!: string;

  @Column({ unique: true, nullable: true })
  phoneNumber!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ nullable: true })
  gender?: string;

  @Column('text', { array: true, nullable: true })
  interests?: string[];

  @Column({ nullable: true })
  profileImageUrl?: string;

  @Column()
  passwordHash?: string;

  @Column({ default: false })
  isPhoneVerified!: boolean;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @OneToMany(() => Events, (event) => event.user)
  events!: Events[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  passwordResetToken!: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires!: Date;
}
