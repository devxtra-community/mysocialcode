import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: {
    id: string;
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
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };

    req.user = { id: decoded.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token',error:err });
  }
};
