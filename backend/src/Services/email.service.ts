import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { logger } from '../utils/logger';

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

export const sendOtpEmail = async (to: string, otp: string) => {
  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAIL_FROM_EMAIL!,
      to,
      subject: 'Your SocialCode verification code',
      text: `Your SocialCode verification code is ${otp}. This code expires in 5 minutes.`,
    });
  } catch (err) {
    logger.error({ err }, 'Error sending OTP email');
    throw new Error('Failed to send OTP email');
  }
};
