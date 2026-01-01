import express from 'express';
import { appDataSouce } from '../data-source';
const Healthrouter = express.Router();
Healthrouter.get('/', async (req, res) => {
  try {
    if (!appDataSouce.isInitialized) {
      return res.status(503).json({
        status: 'eroor',
        service: 'mysocial-code-backend',
        db: 'not initialized',
      });
    }
    await appDataSouce.query('SELECT 1');
    return res.status(200).json({
      status: 'ok',
      service: 'mysocial-code-backend',
      db: 'up',
    });
  } catch (err) {
    return res
      .status(503)
      .json({ status: err, service: 'mysocialcode-backend', db: 'down' });
  }
});
export default Healthrouter;
