import { Request, Response } from 'express';
import { createEventService } from './event.service';
import { logger } from '../../utils/logger';

export interface AuthReq extends Request {
  user?: {
    id: string;
  };
}
export const createEvent = async (req: AuthReq, res: Response) => {
  console.log(req.body);
  console.log('files', req.files);

  try {
    const { title, description, startDate, endDate } = req.body;
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
      files,
    );
    res.status(201).json({ message: 'event created', event: event });
  } catch (err) {
    logger.error({ err }, 'catch in create event worked');
    res.status(400).json({ error: err });
  }
};
