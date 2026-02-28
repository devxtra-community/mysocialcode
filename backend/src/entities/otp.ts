import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column()
  phoneNumber!: string;

  @Column()
  otp!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ default: false })
  verified!: boolean;

  @Column({ default: false })
  consumed!: boolean;

  @Column({ default: 0 })
  attempts!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ default: false })
  sent!: boolean;

  @Column({ unique: true })
  requestId!: string;
}
