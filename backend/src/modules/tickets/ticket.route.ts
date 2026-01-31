import express from 'express';
import { getMyTickets } from './ticket.controller';
import { requireAuth } from '../../middleware/auth.middleware';
const ticketRouter = express.Router();
ticketRouter.get('/getMyTickets', requireAuth, getMyTickets);
export default ticketRouter;
