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
  changePassword,
  sendEmailVerificationOtp,
  verifyEmailOtp,
} from './auth.controller';
import { validate } from '../../middleware/validate';
import {
  changePasswordSchema,
  forgetPasswordSchema,
  loginSchema,
  phoneSchema,
  registerSchema,
  resetPasswordSchema,
} from './auth.schema';
import { requireAuth } from '../../middleware/auth.middleware';

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
authRouter.post(
  '/reset-password',
  validate(resetPasswordSchema),
  resetPassword,
);

authRouter.put(
  '/change-password',
  requireAuth,
  validate(changePasswordSchema),
  changePassword
);

authRouter.post('/send-otp-email', requireAuth, sendEmailVerificationOtp);
authRouter.post('/verify-otp-email', requireAuth, verifyEmailOtp);
export default authRouter;
