import { Request, Response } from 'express';
import { createEventService } from './event.service';
import { logger } from '../../utils/logger';
import { getEventRepository } from './event.repository';
import { getTicketRepository } from '../tickets/ticket.repository';
import { v4 as uuid } from 'uuid';
import { json } from 'zod';
import { log } from 'node:console';
import { EventImage } from '../../entities/EventImage';
import { getUserRepository } from '../user/user.repository';

export interface AuthReq extends Request {
  user?: {
    id: string;
  };
}
export const createEvent = async (req: AuthReq, res: Response) => {
  console.log(req.body);
  console.log('files', req.files);

  try {
    const {
      title,
      description,
      startDate,
      endDate,
      isFree,
      price,
      location,
      capacity,
      category,
      rules,
    } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: 'in side create event  controller no req,user if  case worked',
      });
    }
    const userId = req.user?.id;
    const files = req.files as Express.Multer.File[];
    const event = await createEventService(
      title,
      description,
      userId,
      startDate,
      endDate,
      isFree,
      price,
      location,
      capacity,
      category,
      rules,
      files,
    );

    res
      .status(201)
      .json({ message: 'event created', event: event, success: true });
  } catch (err) {
    logger.error({ err }, 'catch in create event worked');
    res.status(400).json({ error: err });
  }
};

export const getAllEvents = async (req: AuthReq, res: Response) => {
  try {
    const events = await getEventRepository.find({
      where: {
        status: 'published',
      },
      relations: ['image'],
      order: { startDate: 'ASC' },
    });
    return res.status(200).json({
      message: 'fetched data successfully',
      success: true,
      events: events,
    });
  } catch (err) {
    logger.error({ err }, 'catch in get all events workded');
    res.status(400).json({ message: 'failed to fetch events', error: err });
  }
};

export const getSingleEvent = async (req: AuthReq, res: Response) => {
  try {
    const id = req.params.id;
    logger.info({ id }, 'id from params');
    const event = await getEventRepository.findOne({
      where: {
        id: id,
      },
      relations: ['image'],
    });
    console.log(event);
    res.status(200).json({ message: 'found', event });
  } catch (err) {
    res
      .status(500)
      .json({ error: err, message: 'catch in get single event workec' });
  }
};

export const joinEvent = async (req: AuthReq, res: Response) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await getEventRepository.findOne({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.capacity <= 0) {
      return res.status(400).json({ message: 'Event is full' });
    }

    const user = await getUserRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingTicket = await getTicketRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId },
      },
    });

    if (existingTicket) {
      return res.status(409).json({ message: 'You already joined this event' });
    }

    const qrCode = `SC${uuid()}`;

    const ticket = getTicketRepository.create({
      event,
      user,
      qrCode,
    });

    await getTicketRepository.save(ticket);

    event.capacity -= 1;
    await getEventRepository.save(event);

    return res.status(200).json({
      success: true,
      message: 'Joined event',
      ticket: {
        id: ticket.id,
        qrCode: ticket.qrCode,
        status: ticket.status,
      },
    });
  } catch (err) {
    console.error('Join Event Error:', err);
    return res
      .status(500)
      .json({ message: 'Something went wrong', error: err });
  }
};
