import { Router } from 'express';
import {
  sendOtp,
  verifyotp,
  register,
  login,
  logout,
  refreshAccessToken,
} from './auth.controller';

import { validate } from '../../middleware/validate';
import {
  phoneSchema,
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  refreshTokenSchema,
} from './auth.schema';

const authRouter = Router();

authRouter.post('/send-otp',  validate(phoneSchema), sendOtp);
authRouter.post(
  '/verify-otp',

  validate(verifyOtpSchema),
  verifyotp,
);
authRouter.post('/login', validate(loginSchema), login);
authRouter.post('/register', validate(registerSchema), register);
authRouter.post(
  '/refresh-token',
  validate(refreshTokenSchema),
  refreshAccessToken,
);
authRouter.post('/logout', validate(refreshTokenSchema), logout);

export default authRouter;
