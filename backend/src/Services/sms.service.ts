import { env } from '../config/env';
import { logger } from '../utils/logger';
import twilio from 'twilio';

export const sendOtpSms = async (phone: string, otp: string) => {
  const accountSid = env.TWILIO_ACCOUNT_SID;
  const authToken = env.TWILIO_AUTH_TOKEN;
  const fromNumber = env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    throw new Error('Twilio env vars missing');
  }

  const client = twilio(accountSid, authToken);

  await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: fromNumber,
    to: phone,
  });

  logger.info('OTP SMS sent');
};
