import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signAccessToken = (payload: { userId: string }) => {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.ACCESS_TOKEN_SECRET!);
};
