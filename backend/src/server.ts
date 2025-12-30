import dotenv from 'dotenv';
dotenv.config();
import app from './app';
import { logger } from './utils/logger';
import { appDataSouce } from './data-source';
if (!process.env.PORT) {
  throw new Error('PORT is not defined in environment variables');
}

(async () => {
  try {
    await appDataSouce.initialize();
    logger.info('database connected success fully');
  } catch (error) {
    logger.error({ err: error }, 'error connecting the database');

    process.exit(1);
  }
})();

app.listen(process.env.PORT, () => {
  logger.info('server started dont need worry');
});

let test;