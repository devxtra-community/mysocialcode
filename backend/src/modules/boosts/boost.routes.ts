import express from 'express';
import { boostEvent, getBoostEvents } from './boost.controller';
import { requireAuth } from '../../middleware/auth.middleware';
const boostRouter = express.Router();
boostRouter.post('/purchase', requireAuth, boostEvent);
boostRouter.get('/active', requireAuth, getBoostEvents);
export default boostRouter;
