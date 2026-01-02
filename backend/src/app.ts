import express from 'express';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import Healthrouter from './modules/health/health';
import authRouter from './modules/auth/auth.routes'


const app = express();
app.use(express.json());
app.use(
  pinoHttp({ logger, autoLogging: { ignore: (req) => req.url === 'health' } }),
);
app.use('/health', Healthrouter);
app.use('/auth', authRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
