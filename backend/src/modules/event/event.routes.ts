import { Router } from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
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
eventRouter.get('/all-events', getAllEvents);
eventRouter.get('/event-by-id/:id', getEventById);
eventRouter.get('/my-events', requireAuth, getMyEvents);
export default eventRouter;
