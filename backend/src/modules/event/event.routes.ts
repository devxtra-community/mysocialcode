import { Router } from 'express';
import { createEvent, getAllEvents } from './event.controller';
import { requireAuth } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload';
const eventRouter = Router();
eventRouter.post(
  '/create-event',
  requireAuth,
  upload.array('images', 4),
  createEvent,
);
eventRouter.get('/all-events',getAllEvents)
export default eventRouter;
