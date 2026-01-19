export const QUEUES = {
  SEND_OTP: 'send_otp_queue',
} as const;

export type QueueKey = keyof typeof QUEUES;
