import express from 'express';
import { sendOtp } from './auth.controller';
const authRouter = express.Router();
authRouter.post('/send-otp', sendOtp);

export default authRouter;
