import { Request, Response } from 'express';
import { logger } from '../../utils/logger';
import { getBoostRepository } from './boost.repository';
// import { MoreThan } from 'typeorm';
import { razorpay } from '../payment/razorpay';
export interface AuthReq extends Request {
  user?: {
    id: string;
  };
}
export const getBoostEvents = async (req: AuthReq, res: Response) => {
  try {
    const now = new Date();

    const boosts = await getBoostRepository
      .createQueryBuilder('boost')
      .distinctOn(['event.id'])
      .leftJoinAndSelect('boost.event', 'event')
      .leftJoinAndSelect('event.image', 'image')
      .where('boost.endTime > :now', { now })
      .andWhere('boost.status = :status', { status: 'active' })
      .orderBy('event.id')
      .addOrderBy('boost.createdAt', 'DESC')
      .take(10)
      .getMany();

    const events = boosts.map((b) => b.event);

    res.json({
      success: true,
      events,
    });
  } catch (Err) {
    console.log(Err);
    res.status(500).json({ message: 'internal server err', error: Err });
  }
};

export const boostEvent = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'no user id' });
    }
    const oneDay = 24 * 60 * 60 * 1000;
    const { eventId, duration } = req.body;
    logger.info(eventId);
    logger.info(duration);
    if (!eventId || !duration) {
      return res.status(400).json({ message: 'Missing Fields' });
    }
    const pricePerPay = 50;
    const days = Number(duration);

    if (!days || days < 1 || days > 30) {
      return res.status(400).json({ message: 'invalid duration' });
    }

    const amount = days * pricePerPay * 100;

    // const paymentId = `test${Date.now()}`;
    // const boost = getBoostRepository.create({
    //   event: { id: eventId },
    //   user: { id: userId },
    //   startTime: new Date(),
    //   endTime: new Date(Date.now() + duration * oneDay),
    //   status: 'active',
    //   paymentId,
    //   amount,
    // });
    // await getBoostRepository.save(boost);
    const link = await razorpay.paymentLink.create({
      amount: amount,
      currency: 'INR',
      description: 'Event Boost Payment',

      customer: {
        name: 'User',
        email: 'test@test.com',
        contact: '1234567890',
      },

      notify: {
        sms: false,
        email: false,
      },

      reminder_enable: false,

      notes: {
        eventId: String(eventId),
        duration: String(days),
        userId: String(userId),
      },
    });

    res.json({
      url: link.short_url,
    });
  } catch (err) {
    logger.error({ err }, 'catch in boostEvent worked');
    res.status(500).json({ message: 'order failed' });
  }
};
//comment
