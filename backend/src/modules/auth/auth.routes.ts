import { Router } from 'express';
import {
  sendOtp,
  verifyotp,
  register,
  login,
  logout,
  refreshAccessToken,
  forgetPassword,
} from './auth.controller';
import { validate } from '../../middleware/validate';
import { loginSchema, phoneSchema, registerSchema } from './auth.schema';

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

authRouter.post('/forget-password', forgetPassword);

export default authRouter;
