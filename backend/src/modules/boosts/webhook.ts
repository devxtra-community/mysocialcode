import { logger } from '../../utils/logger';
import { getBoostRepository } from './boost.repository';
import { Request, Response } from 'express';
import { getEventRepository } from '../event/event.repository';
import { getUserRepository } from '../user/user.repository';
import { getTicketRepository } from '../tickets/ticket.repository';
import { v4 as uuid } from "uuid";

export const razorPayWebHook = async (req: Request, res: Response) => {
  console.log("webhook worked");

  try {
    const eventType = req.body.event;

    if (eventType !== "payment.captured") {
      return res.status(200).json({ status: "ignored" });
    }

    const payment = req.body.payload.payment.entity;
    const notes = payment.notes;


    if (notes.type === "boost") {
      const oneDay = 24 * 60 * 60 * 1000;

      const boost = getBoostRepository.create({
        event: { id: notes.eventId },
        user: { id: notes.userId },
        startTime: new Date(),
        endTime: new Date(Date.now() + Number(notes.duration) * oneDay),
        status: "active",
        paymentId: payment.id,
        amount: payment.amount / 100,
      });

      await getBoostRepository.save(boost);

      logger.info("Boost created after payment");
    }

    if (notes.type === "ticket") {
      const event = await getEventRepository.findOne({
        where: { id: notes.eventId },
      });

      const user = await getUserRepository.findOne({
        where: { id: notes.userId },
      });

      if (!event || !user) return;

      const ticket = getTicketRepository.create({
        event,
        user,
        qrCode: `SC${uuid()}`,
      });

      await getTicketRepository.save(ticket);

      event.capacity -= 1;
      await getEventRepository.save(event);

      logger.info("Ticket created after payment");
    }

    res.status(200).json({ status: "ok" });

  } catch (err) {
    logger.error({ err }, "Webhook error");
    res.status(500).json({ message: "Webhook error" });
  }
};

