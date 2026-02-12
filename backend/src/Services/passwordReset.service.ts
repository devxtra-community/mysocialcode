import jwt from 'jsonwebtoken';

const PASSWORD_RESET_SECRET = process.env.PASSWORD_RESET_SECRET!;

export const signPasswordResetToken = (userId: string) => {
  return jwt.sign(
    {
      userId,
      purpose: 'password_reset',
    },
    PASSWORD_RESET_SECRET,
    {
      expiresIn: '15m',
    },
  );
};

export const verifyPasswordResetToken = (token: string) => {
  return jwt.verify(token, PASSWORD_RESET_SECRET) as {
    userId: string;
    purpose: string;
  };
};
