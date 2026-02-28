import {
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Events } from './Event';
import { User } from './User';
import { EventTicket } from './Tickets';
@Entity('EventAttendace')
export class EventAttendace {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Events, { onDelete: 'CASCADE' })
  event!: Events;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => EventTicket, { onDelete: 'CASCADE' })
  ticket!: EventTicket;

  @CreateDateColumn()
  scannedAt!: Date;
}
