import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err);

  let message = 'Internal Server Error';

  if (err instanceof Error) {
    message = err.message;
  }

  res.status(500).json({ message });
};
