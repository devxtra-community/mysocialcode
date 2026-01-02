import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

type AppError = {
  statusCode?: number;
  message?: string;
};

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  logger.info('reached inside global error');
  const error = err as AppError;

  const statusCode = error.statusCode ?? 500;
  const message =
    statusCode === 500
      ? 'Internal Server Error'
      : (error.message ?? 'Something went wrong');

  logger.error(
    {
      err,
      path: req.path,
      method: req.method,
    },
    'Unhandled error',
  );

  res.status(statusCode).json({
    success: false,
    message,
  });
};
