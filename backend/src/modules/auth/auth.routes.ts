import express from 'express';
import { sendOtp, verifyotp, register } from './auth.controller';
const authRouter = express.Router();
authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyotp);
authRouter.post('/register', register);

export default authRouter;
