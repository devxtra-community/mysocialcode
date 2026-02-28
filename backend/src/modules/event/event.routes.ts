import { Router } from 'express';
import {
  attendance,
  cancelEvent,
  createEvent,
  getAllEvents,
  getMyEvents,
  getSingleEvent,
  joinEvent,
  searach,
  updateEvent,
} from './event.controller';

import { requireAuth } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/upload';
import { validateBody } from '../../middleware/validate';

import { createEventSchema, updateEventSchema } from './event.schema';

const eventRouter = Router();

eventRouter.post(
  '/create-event',
  requireAuth,
  upload.array('images', 4),
  validateBody(createEventSchema),
  createEvent,
);

eventRouter.get('/all-events', requireAuth, getAllEvents);

eventRouter.get('/getEvent/:id', requireAuth, getSingleEvent);

eventRouter.post('/join-event/:id', requireAuth, joinEvent);

eventRouter.get('/my-events', requireAuth, getMyEvents);

eventRouter.put(
  '/update/:id',
  requireAuth,
  upload.array('images', 4),
  validateBody(updateEventSchema),
  updateEvent,
);

eventRouter.post('/cancel/:id', requireAuth, cancelEvent);

eventRouter.post('/attendance', requireAuth, attendance);

eventRouter.get('/search', searach);

export default eventRouter;
