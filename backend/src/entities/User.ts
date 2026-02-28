import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  DeleteDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Events } from './Event';
import { EventTicket } from './Tickets';

// export enum UserRole {
//   USER = 'USER',
//   ADMIN = 'ADMIN',
// }

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BANNED = 'BANNED',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
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

  @Column({ nullable: false })
  passwordHash!: string;

  @Column({ default: false })
  isPhoneVerified!: boolean;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @OneToMany(() => Events, (event) => event.user)
  events!: Events[];

  @OneToMany(() => EventTicket, (ticket) => ticket.user)
  eventTickets!: EventTicket[];

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  passwordResetToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  passwordResetExpires?: Date;

  // @Index()
  // @Column({ enum: UserRole, default: UserRole.USER })
  // role!: UserRole;

  @Index()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status!: UserStatus;

  @Column({ nullable: true })
  banReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  bannedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  banExpires?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ default: false })
  isFullyVerified!: boolean;
}
