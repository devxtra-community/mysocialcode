import {
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';

import { Events } from './Event';
import { User } from './User';
@Entity('boosts')
export class Boost {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Events, { onDelete: 'CASCADE' })
  event!: Events;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'timestamptz' })
  startTime!: Date;

  @Column({ type: 'timestamptz' })
  endTime!: Date;

  @Column({ default: 'active' })
  status!: 'active' | 'expired' | 'cancelled';

  @Column()
  paymentId!: string;

  @Column('decimal')
  amount!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
