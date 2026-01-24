import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Events } from './Event';

@Entity('event_images')
export class EventImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  imageUrl!: string;

  @ManyToOne(() => Events, (events) => events.image, { onDelete: 'CASCADE' })
  event!: Events;
}
