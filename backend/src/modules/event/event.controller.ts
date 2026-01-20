import { Request, Response } from 'express';
import { createEventService } from './event.service';
import { logger } from '../../utils/logger';
import { getEventRepository } from './event.repository';

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
  rules
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
  files
)

    res.status(201).json({ message: 'event created', event: event,success:true });
  } catch (err) {
    logger.error({ err }, 'catch in create event worked');
    res.status(400).json({ error: err });
  }
};

export const getAllEvents = async(req:AuthReq,res:Response)=>{
 try{
  const events = await getEventRepository.find({
    where:{
      status:"published"
    },
    relations:['image'],
    order:{startDate:'ASC'}
  })
  return res.status(200).json({message:'fetched data successfully', success:true, events:events})

 }catch(err){
logger.error({err},'catch in get all events workded')
  res.status(400).json({message:"failed to fetch events",error:err})
 }
}