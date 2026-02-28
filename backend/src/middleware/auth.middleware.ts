import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { appDataSource } from '../data-source';
import { Admin } from '../entities/Admin';

interface TokenPayload {
  id: string;
  type: 'USER' | 'ADMIN';
}

interface AuthRequest extends Request {
  user?: {
    id: string;
    type: 'USER' | 'ADMIN';
  };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.ACCESS_TOKEN_SECRET!) as TokenPayload;

    if (decoded.type !== 'USER') {
      return res.status(403).json({ message: 'User access required' });
    }

    req.user = { id: decoded.id, type: decoded.type };
    next();
  } catch (err) {
    logger.error('catch in requre auth worked');
    return res
      .status(401)
      .json({ message: 'Invalid or expired token', error: err });
  }
};
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      env.ACCESS_TOKEN_SECRET!,
    ) as TokenPayload;

    if (decoded.type !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const adminRepo = appDataSource.getRepository(Admin);

    const admin = await adminRepo.findOne({
      where: { id: decoded.id },
    });

    if (!admin) {
      return res.status(403).json({ message: 'Admin not found' });
    }

    req.user = {
      id: admin.id,
      type: 'ADMIN',
    };

    next();
  } catch (err) {
    logger.error({ message: 'Admin JWT verification failed', error: err });
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};