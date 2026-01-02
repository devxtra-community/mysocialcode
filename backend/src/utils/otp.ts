import { randomInt } from 'crypto';
export function generateotp() {
  const min = 1000;
  const max = 10000;
  const otp = randomInt(min, max);
  return otp;
}
