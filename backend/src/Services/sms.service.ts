import { logger } from '../utils/logger';
import twilio from 'twilio';

export const sendOtpSms = async (phone: string, otp: string) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

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
