import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Otp } from './entities/opt';
import { RefreshTokenEntity } from './entities/refreshToken';
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
export const appDataSouce = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [User, Otp, RefreshTokenEntity],
  synchronize: true,
});
