import jwt from 'jsonwebtoken';

export const signAccessToken = (payload: { userId: string }) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
};
