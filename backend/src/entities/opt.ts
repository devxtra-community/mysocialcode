import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column()
  phoneNumber!: string;
  @Column()
  otp!: string;
  @Column({ type: 'timestamp' })
  expiresAt!: Date;
  @Column({ default: false })
  verified!: boolean;
  @CreateDateColumn()
  createdAt!: Date;
}
