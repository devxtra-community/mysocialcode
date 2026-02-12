import { z } from 'zod';

export const createEventSchema = z
  .object({
    title: z.string().min(3),

    description: z.string().min(10),

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),

    isFree: z.coerce.boolean(),

    price: z
      .union([z.coerce.number(), z.literal('')])
      .transform((val) => (val === '' ? undefined : val))
      .optional(),

    location: z.string().min(3),

    capacity: z.coerce.number().int().min(1),

    category: z.string(),

    rules: z.string().optional(),
  })
  .refine((data) => data.isFree || data.price !== undefined, {
    message: 'Paid events must have price',
    path: ['price'],
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export const updateEventSchema = z.object({
  title: z.string().min(3).optional(),

  description: z.string().min(10).optional(),

  location: z.string().min(3).optional(),

  capacity: z.coerce.number().int().min(1).optional(),

  category: z.string().optional(),

  rules: z.string().optional(),

  isFree: z.coerce.boolean().optional(),

  price: z.coerce.number().min(0).optional(),

  startDate: z.coerce.date().optional(),

  endDate: z.coerce.date().optional(),
});
