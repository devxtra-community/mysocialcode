import { z } from 'zod';
export const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
});

export const registerSchema = z.object({
  otpId: z.string().uuid(),
  name: z.string().min(1, 'name is required'),
  age: z.number().int().positive().optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  interests: z.array(z.string()).optional(),
  email: z.string().email(),
  // password: z.string().min(8, 'Password must be at least 8 characters').regex(/\d/, 'Password must contain at least one number'),
});
