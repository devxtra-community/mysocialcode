import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { EventImage } from './EventImage';
@Entity()
export class Events {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({ type: 'timestamptz' })
  startDate!: Date;

  @Column({ type: 'timestamptz' })
  endDate!: Date;

  @ManyToOne(() => User, (user) => user.events, { onDelete: 'CASCADE' })
  user!: User;

  @OneToMany(() => EventImage, (image) => image.event, { onDelete: 'CASCADE' })
  image!: EventImage[];
}
