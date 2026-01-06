import api from '@/lib/api';
export const sendOtp = async (phone: string) => {
  const res = await api.post('auth/send-otp', { phoneNumber: phone });
  return res.data;
};
export const verifyOtp = async (phone: string, otp: string) => {
  const res = await api.post('/auth/verify-otp', { phoneNumber: phone, otp });
  return res.data;
};

export const registerUser = async (data: {
  otpId: string;
  name: string;
  email?: string;
  age?: number;
  gender: 'male' | 'female' | 'other';
  interests?: string[];
}) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};
