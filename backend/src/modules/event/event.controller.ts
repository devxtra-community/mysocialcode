import { Request, Response } from 'express';
import { createEventService } from './event.service';
import { logger } from '../../utils/logger';
import {
  getEventAttendaceRepository,
  getEventRepository,
  getImageRepository,
} from './event.repository';
import { getTicketRepository } from '../tickets/ticket.repository';
import { v4 as uuid } from 'uuid';
import { getUserRepository } from '../user/user.repository';
// import { EventImage } from '../../entities/EventImage';
import { uploadEventImage } from './event.upload';
import { appDataSource } from '../../data-source';
import { redisClient } from '../../utils/redis';
import { id } from 'zod/v4/locales';
import { TicketStatus } from '../../entities/Tickets';

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
    const limit = Number(req.query.limit) || 10;
    const cursor = req.query.cursor as string | undefined;
    const cursorId = req.query.id as string | undefined;
    const cacheKey = `events:limit=${limit}:cursor=${cursor || 'none'}:id=${cursorId || 'none'}`;
    //comment
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      logger.info('Served from Redis');
      return res.status(200).json(JSON.parse(cachedData));
    }

    const qb = getEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.image', 'image')
      .where('event.status = :status', { status: 'published' });

    if (cursor && cursorId) {
      qb.andWhere(
        `(event.startDate > :cursor OR (event.startDate = :cursor AND event.id > :id))`,
        { cursor, id: cursorId },
      );
    }

    qb.orderBy('event.startDate', 'ASC')
      .addOrderBy('event.id', 'ASC')
      .take(limit + 1);

    const events = await qb.getMany();

    let hasMore = false;
    if (events.length > limit) {
      hasMore = true;
      events.pop();
    }

    const lastEvent = events[events.length - 1];

    const responseData = {
      success: true,
      events,
      hasMore,
      nextCursor: lastEvent
        ? { startDate: lastEvent.startDate, id: lastEvent.id }
        : null,
    };

    await redisClient.setEx(cacheKey, 60, JSON.stringify(responseData));

    return res.status(200).json(responseData);
  } catch (err) {
    res.status(400).json({ success: false, message: 'failed to fetch events' });
  }
};

export const getSingleEvent = async (req: AuthReq, res: Response) => {
  try {
    const id = req.params.id;
    const userId = req.user?.id;

    const event = await getEventRepository.findOne({
      where: { id },
      relations: ['image', 'user'],
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    logger.info(event.user.id);

    const host = event.user?.id === userId;

    res.status(200).json({
      message: 'found',
      event,
      host,
    });
  } catch (err) {
    console.log('REAL ERROR:', err);
    res.status(500).json({
      message: 'Error fetching event',
    });
  }
};

export const getMyEvents = async (req: AuthReq, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const events = await getEventRepository.find({
      where: { user: { id: req.user.id } },
      relations: ['image', 'user'],
      order: { createdAt: 'DESC' },
    });

    return res.status(200).json({
      success: true,
      message: 'My events fetched',
      events,
    });
  } catch (err) {
    logger.error({ err }, 'getMyEvents failed');
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch events' });
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

    if (event.status !== 'published') {
      return res.status(400).json({ message: 'Event is not open for joining' });
    }

    if (new Date(event.endDate) < new Date()) {
      return res.status(400).json({ message: 'Cannot join a past event' });
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

export const updateEvent = async (req: AuthReq, res: Response) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await getEventRepository.findOne({
      where: { id: eventId },
      relations: ['image', 'user'], // ✅ FIXED
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const {
      title,
      description,
      startDate,
      endDate,
      location,
      capacity,
      category,
      rules,
      existingImages,
      isFree,
      price,
    } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (location !== undefined) event.location = location;
    if (category !== undefined) event.category = category;
    if (rules !== undefined) event.rules = rules;

    if (capacity !== undefined) {
      const parsed = Number(capacity);
      if (isNaN(parsed) || parsed < 0) {
        return res.status(400).json({ message: 'Invalid capacity' });
      }
      event.capacity = parsed;
    }

    if (isFree !== undefined) {
      event.isFree = isFree === 'true' || isFree === true;
      event.price = event.isFree ? 0 : Number(price || 0);
    }

    if (startDate !== undefined) {
      const d = new Date(startDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: 'Invalid startDate' });
      }
      event.startDate = d;
    }

    if (endDate !== undefined) {
      const d = new Date(endDate);
      if (isNaN(d.getTime())) {
        return res.status(400).json({ message: 'Invalid endDate' });
      }
      event.endDate = d;
    }

    if (event.startDate && event.endDate && event.endDate < event.startDate) {
      return res
        .status(400)
        .json({ message: 'End date cannot be before start date' });
    }

    // ✅ Image handling
    let keepImages: string[] = [];
    if (existingImages) {
      keepImages = Array.isArray(existingImages)
        ? existingImages
        : JSON.parse(existingImages);
    }

    const imagesToDelete = event.image.filter(
      (img) => !keepImages.includes(img.imageUrl),
    );

    const files = req.files as Express.Multer.File[] | undefined;

    await appDataSource.transaction(async (manager) => {
      if (imagesToDelete.length) {
        await manager.remove(imagesToDelete);
      }

      await manager.save(event);

      if (files?.length) {
        for (const file of files) {
          const imageUrl = await uploadEventImage(file);
          const image = getImageRepository.create({ imageUrl, event });
          await manager.save(image);
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Event updated',
      event,
    });
  } catch (err) {
    logger.error({ err }, 'Error in updateEvent');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const cancelEvent = async (req: AuthReq, res: Response) => {
  try {
    const eventId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const event = await getEventRepository.findOne({
      where: { id: eventId },
      relations: ['user'],
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.user.id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (event.status === 'canceled') {
      return res.status(400).json({ message: 'Event already canceled' });
    }

    if (event.endDate && new Date(event.endDate) < new Date()) {
      return res.status(400).json({ message: 'Cannot cancel a past event' });
    }

    event.status = 'canceled';
    await getEventRepository.save(event);

    return res.status(200).json({
      success: true,
      message: 'Event canceled',
      event,
    });
  } catch (err) {
    logger.error({ err }, 'Error in cancelEvent');
    return res.status(500).json({
      success: false,
      message: 'Something went wrong',
    });
  }
};

export const attendance = async (req: AuthReq, res: Response) => {
  console.log(req.body);
  try {
    const { qrCode, eventId } = req.body;
    const userId = req.user?.id;

    if (!qrCode || !eventId) {
      return res.status(400).json({
        success: false,
        message: 'qrCode and eventId are required',
      });
    }

    const scan = await getTicketRepository.findOne({
      where: {
        qrCode: qrCode,
      },
      relations: ['event', 'user'],
    });

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Invalid ticket',
      });
    }

    if (scan.event.id !== eventId) {
      return res.status(400).json({
        success: false,
        message: 'Ticket not valid for this event',
      });
    }

    if (scan.status == TicketStatus.USED) {
      return res.status(400).json({
        success: false,
        message: 'ticket already used',
      });
    }

    scan.status = TicketStatus.USED;
    await getTicketRepository.save(scan);
    const attendance = getEventAttendaceRepository.create({
      event: scan.event,
      user: scan.user,
      ticket: scan,
    });
    await getEventAttendaceRepository.save(attendance);
    return res.status(200).json({ success: true, message: 'entry is allowed' });
  } catch (err) {
    logger.error({ err }, 'catch in scan api worked');
    res.status(500).json({
      success: false,
      message: 'something bad happend catch in scan api worked',
    });
  }
};

export const searach = async (req: AuthReq, res: Response) => {
  logger.info('reached here at search api');
  try {
    const q = req.query.event as string;
    logger.info(q);
    if (!q || q.trim() === '') {
      return res.json([]);
    }
    const event = await getEventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.image', 'image')
      .where('event.title ILIKE :q', { q: `%${q}%` })
      .orWhere('event.category ILIKE :q', { q: `%${q}%` })
      .limit(10)
      .getMany();
    res.json({ message: 'fetched', events: event });
  } catch (err) {
    logger.error({ err }, 'catch in seach worked');
    return res.status(500).json({ message: 'internal server error' });
  }
};
