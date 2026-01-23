import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Otp } from './entities/otp';
import { RefreshTokenEntity } from './entities/refreshToken';
import { Events } from './entities/Event';
import { EventImage } from './entities/EventImage';
import { EventTicket } from './entities/Tickets';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
export const appDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Otp, RefreshTokenEntity, Events, EventImage,EventTicket],
  synchronize: true,
});
