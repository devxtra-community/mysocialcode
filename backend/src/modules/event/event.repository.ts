import { appDataSource } from '../../data-source';
import { Events } from '../../entities/Event';
import { EventImage } from '../../entities/EventImage';
import { EventAttendace } from '../../entities/EventAttendance';
// import { EventTicket } from '../../entities/Tickets';
export const getEventRepository = appDataSource.getRepository(Events);

export const getImageRepository = appDataSource.getRepository(EventImage);

export const getEventAttendaceRepository = appDataSource.getRepository(EventAttendace)
