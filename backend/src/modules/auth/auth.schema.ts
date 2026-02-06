// // import { z } from 'zod';
// // export const phoneSchema = z.object({
// //   phoneNumber: z.string().min(10, 'Invalid phone number'),
// // });

// // export const registerSchema = z
// //   .object({
// //     otpId: z.string().uuid(),

// //     name: z.string().min(1, 'Name is required'),

// //     age: z.number().int().positive().optional(),

// //     gender: z.enum(['male', 'female', 'other']).optional(),

// //     interests: z.array(z.string()).optional(),

// //     email: z.string().email('Invalid email address'),

// //     password: z.string().min(8, 'Password must be at least 8 characters'),

// //     confirmPassword: z
// //       .string()
// //       .min(8, 'Confirm password must be at least 8 characters'),
// //   })
// //   .refine((data) => data.password === data.confirmPassword, {
// //     message: 'Passwords do not match',
// //     path: ['confirmPassword'],
// //   });

// // export const loginSchema = z.object({
// //   phoneNumber: z.string().min(10, 'Phone number is required'),

// //   password: z.string().min(1, 'Password is required'),
// // });

// import { z } from 'zod';

// export const phoneSchema = z
//   .object({
//     phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
//   })
//   .strict();

// export const loginSchema = z
//   .object({
//     phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),

//     password: z.string().min(8, 'Password required'),
//   })
  

// export const registerSchema = z
//   .object({
//     otpId: z.string().uuid('Invalid OTP'),

//     name: z
//       .string()
//       .min(2, 'Name too short')
//       .max(50, 'Name too long')
//       .regex(/^[A-Za-z ]+$/, 'Invalid name')
//       .trim(),

//     age: z.coerce
//       .number()
//       .int()
//       .min(13, 'Must be at least 13')
//       .max(120, 'Invalid age')
//       .optional(),

//     gender: z.enum(['male', 'female', 'other']).optional(),

//     interests: z.array(z.string().min(1)).optional(),

//     email: z.string().email('Invalid email').toLowerCase(),

//     password: z
//       .string()
//       .min(8)
//       .regex(/[A-Z]/, 'Must contain uppercase letter')
//       .regex(/[a-z]/, 'Must contain lowercase letter')
//       .regex(/[0-9]/, 'Must contain number')
//       .regex(/[@$!%*?&]/, 'Must contain special character'),

//     confirmPassword: z.string(),
//   })
//   .refine((data) => data.password === data.confirmPassword, {
//     message: 'Passwords do not match',
//     path: ['confirmPassword'],
//   })
//   .strict();

// export const verifyOtpSchema = z
//   .object({
//     phoneNumber: z.string().regex(/^[6-9]\d{9}$/),
//     otp: z.string().regex(/^\d{4,6}$/, 'Invalid OTP'),
//   })
//   .strict();

// export const refreshTokenSchema = z
//   .object({
//     refreshToken: z.string().min(20),
//   })
//   .strict();
