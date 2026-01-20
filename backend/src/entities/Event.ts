import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
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

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'int', default: 0 })
  bookedSeats!: number;

  @Column()
  location!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ default: true })
  isFree!: boolean;

  @Column()
  category!: string;

  @Column({ type: 'text', nullable: true })
  rules?: string;

  @Column({ default: 'draft' })
  status!: 'draft' | 'published' | 'cancelled';

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

}
