import { z } from 'zod';
export const emailSchema = z.object({
  email: z.string().email('Invalid email'),
});

export const registerSchema = z.object({
  otpId: z.string().uuid(),
  name: z.string().min(1, 'name is required'),
  age: z.number().int().positive().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  interests: z.array(z.string()).optional(),
});
