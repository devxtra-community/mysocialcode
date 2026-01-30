import { createClient } from 'redis';
import { logger } from './logger';
export const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    logger.info('Redis connected');
  }
}
