import z from 'zod';

export const phoneSchema = z.object({
  phoneNumber: z.string().min(10, 'Invalid phone number'),
});

export const loginSchema = z
  .object({
    phoneNumber: z.string().min(10, 'Phone number is required'),

    password: z.string().min(8, 'Password required'),
  })
  .strict();

export const registerSchema = z
  .object({
    otpId: z.string().uuid('Invalid OTP'),

    name: z
      .string()
      .min(2, 'Name too short')
      .max(50, 'Name too long')
      .regex(/^[A-Za-z ]+$/, 'Invalid name')
      .trim(),

    age: z.coerce
      .number()
      .int()
      .min(18, 'Must be at least 18')
      .max(120, 'Invalid age')
      .optional(),

    gender: z.enum(['male', 'female', 'other']).optional(),

    interests: z.array(z.string().min(1)).optional(),

    email: z.string().email('Invalid email').toLowerCase(),

    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/, 'Must contain uppercase letter')
      .regex(/[a-z]/, 'Must contain lowercase letter')
      .regex(/[0-9]/, 'Must contain number')
      .regex(/[@$!%*?&]/, 'Must contain special character'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .strict();

export const forgotPasswordSchema = z.
object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, 'Email is required')
    .max(254, 'Email too long')
    .email('Invalid email format'),
});

// export const verifyOtpSchema = z
//   .object({
//     phoneNumber: z.string().min(10, 'Invalid phone number'),
//     otp: z.string().min(4, 'Invalid OTP'),
//   })
//   .strict();

// export const refreshTokenSchema = z
//   .object({
//     refreshToken: z.string().min(20),
//   })
//   .strict();
