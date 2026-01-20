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
    // 1️⃣ Connect to database
    await appDataSource.initialize();
    logger.info('database connected successfully');

    // 2️⃣ Connect to RabbitMQ (API is a PRODUCER)
    await connectRabbitMQ();
    logger.info('rabbitmq connected successfully');

    // 3️⃣ Start HTTP server
    app.listen(PORT, () => {
      logger.info(`server started dont need worry on port ${PORT}`);
    });
  } catch (err) {
    logger.error({ err }, 'failed to start server');
    process.exit(1);
  }
};

startServer();
