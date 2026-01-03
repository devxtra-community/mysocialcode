import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

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

  @CreateDateColumn()
  createdAt!: Date;
}
