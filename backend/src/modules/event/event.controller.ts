import { Request, Response } from 'express';
import { createEventService } from './event.service';
import { logger } from '../../utils/logger';
import { getEventRepository, getImageRepository } from './event.repository';
import { getTicketRepository } from '../tickets/ticket.repository';
import { v4 as uuid } from 'uuid';
import { getUserRepository } from '../user/user.repository';
// import { EventImage } from '../../entities/EventImage';
import { uploadEventImage } from './event.upload';
import { appDataSource } from '../../data-source';

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

    // ✅ Field updates
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
    if (event.status === 'canceled') {
      return res.status(400).json({ message: 'Event already canceled' });
    }
    console.log('EVENT STATUS:', event.status);

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
