import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { logger } from './utils/logger';
import { notFound } from './middleware/notFound';
import { errorHandler } from './middleware/errorHandler';
import Healthrouter from './modules/health/health';
import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/user/user.routes';
import eventRouter from './modules/event/event.routes';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  pinoHttp({
    logger,
    autoLogging: { ignore: (req) => req.url === '/health' },
    serializers: {
      req: () => undefined,
      res: () => undefined,
    },
    customSuccessMessage: (req, res) =>
      `${req.method} ${req.url} ${res.statusCode}`,
  }),
);

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

app.use('/health', Healthrouter);
app.use('/auth', authRouter);
app.use('/event', eventRouter);
app.use('/user', userRouter);
app.use(notFound);
app.use(errorHandler);
export default app;