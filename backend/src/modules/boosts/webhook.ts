import { logger } from '../../utils/logger';
import { getBoostRepository } from './boost.repository';
import { Request, Response } from 'express';
export const razorPayWebHook = async (req: Request, res: Response) => {
  console.log('web hook worked');
  try {
    const event = req.body.event;
    if (event == 'payment.captured') {
      const payment = req.body.payload.payment.entity;
      const { eventId, duration, userId } = payment.notes;
      const oneDay = 24 * 60 * 60 * 1000;
      const boost = getBoostRepository.create({
        event: { id: eventId },
        user: { id: userId },
        startTime: new Date(),
        endTime: new Date(Date.now() + duration * oneDay),
        status: 'active',
        paymentId: payment.id,
        amount: payment.amount / 100,
      });
      await getBoostRepository.save(boost);
      logger.info('boost crated after payment');
    }
    res.status(200).json({ status: 'ok', message: 'boost created' });
  } catch (err) {
    logger.error('error in razor pay workerd');
  }
};
