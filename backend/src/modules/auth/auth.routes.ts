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

const authRouter = Router();

authRouter.post('/send-otp', sendOtp);
authRouter.post(
  '/verify-otp',

  verifyotp,
);
authRouter.post('/login',  login);
authRouter.post('/register', register);
authRouter.post(
  '/refresh-token',

  refreshAccessToken,
);
authRouter.post('/logout', logout);

export default authRouter;
