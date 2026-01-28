import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { getTicketRepository } from './ticket.repository';

export interface AuthReq extends Request {
  user?: {
    id: string;
  };
}
export const getMyTickets = async (req: AuthReq, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const tickets = await getTicketRepository.find({
      where: {
        user: { id: userId },
      },
      relations: ['event'],
      order: { createdAt: 'DESC' },
    });

    const ticketsWithQR = await Promise.all(
      tickets.map(async (ticket) => {
        const qrImage = await QRCode.toDataURL(ticket.qrCode);

        return {
          id: ticket.id,
          status: ticket.status,
          qrCode: ticket.qrCode,
          qrImage,
          event: {
            id: ticket.event.id,
            title: ticket.event.title,
            startDate: ticket.event.startDate,
            location: ticket.event.location,
          },
        };
      }),
    );

    return res.status(200).json({
      success: true,
      tickets: ticketsWithQR,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch tickets' });
  }
};
