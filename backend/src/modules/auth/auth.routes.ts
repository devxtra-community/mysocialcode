import { Router } from 'express';
import {
  sendOtp,
  verifyotp,
  register,
  login,
  logout,
  refreshAccessToken,
} from './auth.controller';

// import { validate } from '../../middleware/validate';
// import {
//   phoneSchema,
//   registerSchema,
//   loginSchema,
//   verifyOtpSchema,
//   refreshTokenSchema,
// } from './auth.schema';
// import { createLimiter } from '../../middleware/rateLimit';

// const otpLimiter = createLimiter({
//   windowMs: 10 * 60 * 1000,
//   max: 3,
//   keyPrefix: 'otp:',
// });

// const loginLimiter = createLimiter({
//   windowMs: 10 * 60 * 1000,
//   max: 5,
//   keyPrefix: 'login:',
// });

const authRouter = Router();

authRouter.post('/send-otp', sendOtp);
authRouter.post(
  '/verify-otp',
  
  verifyotp,
);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.post(
  '/refresh-token',
  
  refreshAccessToken,
);
authRouter.post('/logout',  logout);

export default authRouter;
