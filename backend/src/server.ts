import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { logger } from './utils/logger';
import { appDataSource } from './data-source';
import { connectRabbitMQ } from './messaging/rabbitmq/connect';

const PORT = process.env.PORT;

if (!PORT) {
  throw new Error('PORT is not defined in environment variables');
}

const startServer = async () => {
  try {
    await appDataSource.initialize();
    logger.info('database connected successfully');

    await connectRabbitMQ();
    logger.info('rabbitmq connected successfully');

    app.listen(PORT, () => {
      logger.info(`server started dont need worry on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'failed to start server');
    process.exit(1);
  }
};

startServer();
