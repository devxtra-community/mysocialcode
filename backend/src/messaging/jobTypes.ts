export interface SendOtpJob {
  phone: string;
  otp: string;
  purpose: 'login' | 'register' | 'reset_password';
  retryCount: number;
  requestId: string;
}
