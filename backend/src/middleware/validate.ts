import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

export const validate =
  (schema: z.ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {

    const result = schema.safeParse(req.body);

    if (!result.success) {
      const firstIssue = result.error.issues[0];

      return res.status(400).json({
        success: false,
        message: firstIssue.message,   
        field: firstIssue.path[0] ?? null,
      });
    }

    req.body = result.data;
    next();
  };
