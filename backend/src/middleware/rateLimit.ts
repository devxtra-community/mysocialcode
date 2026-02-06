import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../utils/redis';

export const createLimiter = (opts: {
  windowMs: number;
  max: number;
  keyPrefix: string;
}) =>
  rateLimit({
    windowMs: opts.windowMs,
    max: opts.max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: async (...args: string[]) => {
        return redisClient.sendCommand(args);
      },
      prefix: opts.keyPrefix,
    }),
    message: {
      message: 'Too many requests. Try again later.',
    },
  });
