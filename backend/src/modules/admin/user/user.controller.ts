import { Request, Response } from 'express';
import { appDataSource } from '../../../data-source';
import { User, UserStatus } from '../../../entities/User';
import { IsNull } from 'typeorm';

export const listUsers = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      role,
      search,
    } = req.query as {
      page?: string;
      limit?: string;
      status?: string;
      role?: string;
      search?: string;
    };

    const pageNumber = Math.max(parseInt(page), 1);
    const limitNumber = Math.min(Math.max(parseInt(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const userRepo = appDataSource.getRepository(User);

    const qb = userRepo
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .loadRelationCountAndMap('user.ticketsCount', 'user.eventTickets')
      .loadRelationCountAndMap('user.eventsCount', 'user.events');

    if (status) {
      qb.andWhere('user.status = :status', {
        status: status.toUpperCase(),
      });
    }

    if (role) {
      qb.andWhere('user.role = :role', {
        role: role.toUpperCase(),
      });
    }

    if (search) {
      qb.andWhere(
        '(LOWER(user.name) LIKE :search OR LOWER(user.email) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    qb.orderBy('user.createdAt', 'DESC').skip(skip).take(limitNumber);

    const [users, total] = await qb.getManyAndCount();

    type userWithCounts = User & {
      ticketsCount?: number;
      eventsCount?: number;
    };

    const typedUsers = users as userWithCounts[];

    const rawCounts = await userRepo
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('user.deletedAt IS NULL')
      .groupBy('user.status')
      .getRawMany();

    const counts = {
      all: 0,
      active: 0,
      inactive: 0,
      banned: 0,
    };

    rawCounts.forEach((row) => {
      const status = row.status as UserStatus;
      const count = Number(row.count);

      counts.all += count;

      if (status === UserStatus.ACTIVE) {
        counts.active = count;
      } else if (status === UserStatus.INACTIVE) {
        counts.inactive = count;
      } else if (status === UserStatus.BANNED) {
        counts.banned = count;
      }
    });

    return res.json({
      counts: {
        all: counts.all,
        active: counts.active,
        inactive: counts.inactive,
        banned: counts.banned,
      },
      data: typedUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        // role: u.role.toLowerCase(),
        joinedAt: u.createdAt,
        eventsCount: u.eventsCount ?? 0,
        ticketsCount: u.ticketsCount ?? 0,
        status: u.status.toLowerCase(),
      })),
      pagination: {
        page: pageNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.events', 'event')
      .leftJoinAndSelect('user.eventTickets', 'ticket')
      .leftJoinAndSelect('ticket.event', 'ticketEvent')
      .where('user.id = :id', { id })
      .andWhere('user.deletedAt IS NULL')
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.phoneNumber',
        'user.age',
        'user.gender',
        'user.interests',
        'user.profileImageUrl',
        'user.isPhoneVerified',
        'user.isEmailVerified',
        'user.role',
        'user.status',
        'user.createdAt',

        'event.id',
        'event.title',
        'event.startDate',
        'event.endDate',
        'event.location',

        'ticket.id',
        'ticket.status',
        'ticket.qrCode',

        'ticketEvent.id',
        'ticketEvent.title',
        'ticketEvent.startDate',
        'ticketEvent.location',
      ])
      .getOne();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      age: user.age,
      gender: user.gender,
      interests: user.interests,
      profileImageUrl: user.profileImageUrl,
      isPhoneVerified: user.isPhoneVerified,
      isEmailVerified: user.isEmailVerified,
      // role: user.role.toLowerCase(),
      status: user.status.toLowerCase(),
      joinedAt: user.createdAt,

      events:
        user.events?.map((e) => ({
          id: e.id,
          title: e.title,
          startDate: e.startDate,
          endDate: e.endDate,
          location: e.location,
        })) || [],

      tickets:
        user.eventTickets?.map((t) => ({
          id: t.id,
          status: t.status,
          qrCode: t.qrCode,
          event: t.event
            ? {
                id: t.event.id,
                title: t.event.title,
                startDate: t.event.startDate,
                location: t.event.location,
              }
            : null,
        })) || [],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userRepo = appDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: userId, deletedAt: IsNull() },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.status === UserStatus.BANNED) {
      return res.status(400).json({
        message: 'Cannot toggle a banned user',
      });
    }

    user.status =
      user.status === UserStatus.ACTIVE
        ? UserStatus.INACTIVE
        : UserStatus.ACTIVE;

    await userRepo.save(user);

    return res.json({
      message: 'User status toggled',
      status: user.status.toLowerCase(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
