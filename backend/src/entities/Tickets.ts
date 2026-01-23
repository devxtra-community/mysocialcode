import { PrimaryGeneratedColumn,Column,CreateDateColumn,ManyToOne,Unique,Index, Entity, JoinColumn } from "typeorm";
import { Events } from './Event';
import { User } from "./User";

enum TicketStatus{
ACTIVE = "ACTIVE",
  USED = "USED",
  CANCELLED = "CANCELLED",
}

@Entity("event_tickets")
@Unique(["event", "user"])
export class EventTicket{
    @PrimaryGeneratedColumn('uuid')
    id!:string

   @ManyToOne(() => Events, { onDelete: 'CASCADE' })
@JoinColumn({ name: "event_id" })
event!: Events;
;

    @ManyToOne(()=>User,{onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user!:User

    @Index()
    @Column()
    qrCode!: string;

     @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.ACTIVE,
  })
  status!: TicketStatus

  @CreateDateColumn()
  createdAt!: Date;



}
