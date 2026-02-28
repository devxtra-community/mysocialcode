import dotenv from 'dotenv';

dotenv.config();

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `Missing required enviornment variable: ${name}\n` +
        `check your .env file`,
    );
  }

  return value;
}

function optional(name: string, defaultvalue?: string): string | undefined {
  const value = process.env[name];

  if (value === undefined || value === '') {
    return defaultvalue;
  }
  return value;
}

export const env = {
  NODE_ENV: optional('NODE_ENV', 'development'),
  PORT: Number(optional('PORT', '4000')),

  DATABASE_URL: required('DATABASE_URL'),

  R2_ENDPOINT: required('R2_ENDPOINT'),
  R2_ACCESS_KEY_ID: required('R2_ACCESS_KEY_ID'),
  R2_SECRET_ACCESS_KEY: required('R2_SECRET_ACCESS_KEY'),
  R2_BUCKET_NAME: required('R2_BUCKET_NAME'),
  R2_PUBLIC_URL: required('R2_PUBLIC_URL'),

  ACCESS_TOKEN_SECRET: required('ACCESS_TOKEN_SECRET'),
  PASSWORD_RESET_SECRET: required('PASSWORD_RESET_SECRET'),

  FRONTEND_URL: required('FRONTEND_URL'),

  MAILGUN_API_KEY: optional('MAILGUN_API_KEY'),
  MAILGUN_DOMAIN: optional('MAILGUN_DOMAIN'),
  MAIL_FROM_EMAIL: optional('MAIL_FROM_EMAIL'),

  TWILIO_ACCOUNT_SID: optional('TWILIO_ACCOUNT_SID'),
  TWILIO_AUTH_TOKEN: optional('TWILIO_AUTH_TOKEN'),
  TWILIO_FROM_NUMBER: optional('TWILIO_FROM_NUMBER'),

  RAZORPAY_KEY_ID: optional('RAZORPAY_KEY_ID'),
  RAZORPAY_KEY_SECRET: optional('RAZORPAY_KEY_SECRET'),

  RABBITMQ_URL: optional('RABBITMQ_URL'),
};
