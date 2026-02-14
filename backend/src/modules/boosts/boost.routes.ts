import express from 'express';
import { boostEvent, getBoostEvents } from './boost.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { razorPayWebHook } from './webhook';

const boostRouter = express.Router();
boostRouter.post('/purchase', requireAuth, boostEvent);
boostRouter.get('/active', requireAuth, getBoostEvents);
boostRouter.post('/webhook', razorPayWebHook);
export default boostRouter;
