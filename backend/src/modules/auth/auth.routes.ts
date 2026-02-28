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
import { validateBody } from '../../middleware/validate';
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

authRouter.post('/send-otp', validateBody(phoneSchema), sendOtp);
authRouter.post(
  '/verify-otp',

  verifyotp,
);
authRouter.post('/login', validateBody(loginSchema), login);
authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post(
  '/refresh-token',

  refreshAccessToken,
);
authRouter.post('/logout', logout);

authRouter.post(
  '/forget-password',
  validateBody(forgetPasswordSchema),
  forgetPassword,
);
authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  resetPassword,
);

authRouter.put(
  '/change-password',
  requireAuth,
  validateBody(changePasswordSchema),
  changePassword,
);

authRouter.post('/send-otp-email', requireAuth, sendEmailVerificationOtp);
authRouter.post('/verify-otp-email', requireAuth, verifyEmailOtp);

export default authRouter;
