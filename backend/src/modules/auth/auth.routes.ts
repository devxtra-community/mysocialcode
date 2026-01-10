import express from 'express';
import { sendOtp, verifyotp, register, login } from './auth.controller';
const authRouter = express.Router();
authRouter.post('/send-otp', sendOtp);
authRouter.post('/verify-otp', verifyotp);
authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;
