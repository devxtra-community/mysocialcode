import { Router } from 'express';
import {
  sendOtp,
  verifyotp,
  register,
  login,
  logout,
  refreshAccessToken,
  forgetPassword,
  resetPassword,
} from './auth.controller';
import { validate } from '../../middleware/validate';
import {
  forgetPasswordSchema,
  loginSchema,
  phoneSchema,
  registerSchema,
  resetPasswordSchema,
} from './auth.schema';

const authRouter = Router();

authRouter.post('/send-otp', validate(phoneSchema), sendOtp);
authRouter.post(
  '/verify-otp',

  verifyotp,
);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/register', validate(registerSchema), register);
authRouter.post(
  '/refresh-token',

  refreshAccessToken,
);
authRouter.post('/logout', logout);

authRouter.post(
  '/forget-password',
  validate(forgetPasswordSchema),
  forgetPassword,
);
authRouter.put('/reset-password', validate(resetPasswordSchema), resetPassword);

export default authRouter;
