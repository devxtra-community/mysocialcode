import { Router } from 'express';
import {
  createEvent,
  getAllEvents,
  getSingleEvent,
  joinEvent,
} from './event.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload';
const eventRouter = Router();
eventRouter.post(
  '/create-event',
  requireAuth,
  upload.array('images', 4),
  createEvent,
);
eventRouter.get('/all-events', requireAuth, getAllEvents);
eventRouter.get('/getEvent/:id', requireAuth, getSingleEvent);
eventRouter.post('/join-event/:id', requireAuth, joinEvent);
export default eventRouter;
