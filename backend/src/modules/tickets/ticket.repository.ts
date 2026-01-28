import { appDataSource } from '../../data-source';
import { EventTicket } from '../../entities/Tickets';

export const getTicketRepository = appDataSource.getRepository(EventTicket);
