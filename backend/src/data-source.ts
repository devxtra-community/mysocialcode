import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Otp } from './entities/otp';
import { RefreshTokenEntity } from './entities/refreshToken';
import { Events } from './entities/Event';
import { EventImage } from './entities/EventImage';
import { EventTicket } from './entities/Tickets';
import { Boost } from './entities/Boost';
import { env } from './config/env';
if (!env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
export const appDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [
    User,
    Otp,
    RefreshTokenEntity,
    Events,
    EventImage,
    EventTicket,
    Boost,
  ],
  synchronize: false,
  migrations: ['src/migrations/*.ts'],
});
