import Mailgun from 'mailgun.js';
import FormData from 'form-data';
import { logger } from '../utils/logger';
import { env } from '../config/env';

const mailgun = new Mailgun(FormData);

const mg = mailgun.client({
  username: 'api',
  key: env.MAILGUN_API_KEY!,
});

export const sendOtpEmail = async (email: string, otp: number) => {
  try {
    await mg.messages.create(env.MAILGUN_DOMAIN!, {
      from: env.MAIL_FROM_EMAIL!,
      to: email,
      subject: 'Your SocialCode verification code',
      text: `Your SocialCode verification code is ${otp}. This code expires in 5 minutes.`,
    });
  } catch (err) {
    logger.error({ err }, 'Error sending OTP email');
    throw new Error('Failed to send OTP email');
  }
};

const resetTemplate = (url: string): string => `
  <div style="font-family: Arial, sans-serif;">
    <h2>Reset Your Password</h2>
    <p>Click the button below to reset your password:</p>

    <a href="${url}" 
       style="
         padding:10px 20px;
         background:#4CAF50;
         color:white;
         text-decoration:none;
         border-radius:5px;
         display:inline-block;
       ">
       Reset Password
    </a>

    <p style="margin-top:15px;">Or use this link:</p>
    <p>${url}</p>

    <p style="color:red;">This link expires in 15 minutes.</p>
  </div>
`;

export const sendLinkEmail = async (to: string, url: string): Promise<void> => {
  try {
    await mg.messages.create(env.MAILGUN_DOMAIN!, {
      from: env.MAIL_FROM_EMAIL!,
      to,
      subject: 'Reset your SocialCode password',

      text: `Reset your password using this link: ${url}`,

      html: resetTemplate(url),
    });

    console.log('Reset email sent successfully');
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
};
