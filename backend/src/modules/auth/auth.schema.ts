import { z } from 'zod';
export const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
});

export const registerSchema = z
  .object({
    otpId: z.string().uuid(),

    name: z.string().min(1, 'Name is required'),

    age: z.number().int().positive().optional(),

    gender: z.enum(['male', 'female', 'other']).optional(),

    interests: z.array(z.string()).optional(),

    email: z.string().email('Invalid email address'),

    password: z.string().min(8, 'Password must be at least 8 characters'),

    confirmPassword: z
      .string()
      .min(8, 'Confirm password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number is required'),

  password: z.string().min(1, 'Password is required'),
});
