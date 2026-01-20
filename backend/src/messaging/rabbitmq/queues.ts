export const QUEUES = {
  SEND_OTP: 'send_otp_queue',
  SEND_OTP_DLQ: 'send_otp_dlq',
} as const;

export type QueueKey = keyof typeof QUEUES;
